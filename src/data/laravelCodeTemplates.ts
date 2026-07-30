/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LaravelFile } from '../types';

export const LARAVEL_CODEBASE_FILES: LaravelFile[] = [
  {
    path: 'database/migrations/2026_07_21_000001_create_binary_trees_table.php',
    name: 'CreateBinaryTreesTable.php',
    type: 'migration',
    content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for Binary MLM structural layout.
     * Incorporates left/right volumes and carries.
     */
    public function up(): void
    {
        Schema::create('binary_trees', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $blueprint->foreignId('parent_id')->nullable()->constrained('users')->onDelete('set null');
            $blueprint->enum('position', ['left', 'right']);
            
            // Financial Volume Tracking
            $blueprint->decimal('left_pv', 15, 2)->default(0.00);
            $blueprint->decimal('right_pv', 15, 2)->default(0.00);
            $blueprint->decimal('left_carry_forward', 15, 2)->default(0.00);
            $blueprint->decimal('right_carry_forward', 15, 2)->default(0.00);
            
            $blueprint->timestamps();

            // Guard against placing more than one user per leg
            $blueprint->unique(['parent_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('binary_trees');
    }
};`
  },
  {
    path: 'app/Models/BinaryTree.php',
    name: 'BinaryTree.php',
    type: 'model',
    content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

/**
 * Class BinaryTree
 * Manages Left/Right child nodes and volumes for Binary Commissions.
 */
class BinaryTree extends Model
{
    protected $fillable = [
        'user_id',
        'parent_id',
        'position',
        'left_pv',
        'right_pv',
        'left_carry_forward',
        'right_carry_forward'
    ];

    protected $casts = [
        'left_pv' => 'decimal:2',
        'right_pv' => 'decimal:2',
        'left_carry_forward' => 'decimal:2',
        'right_carry_forward' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Scope to find binary children of a given parent
     */
    public function children()
    {
        return $this->hasMany(BinaryTree::class, 'parent_id', 'user_id');
    }
}`
  },
  {
    path: 'app/Repositories/WalletRepository.php',
    name: 'WalletRepository.php',
    type: 'repository',
    content: `<?php

namespace App\\Repositories;

use App\\Models\\Wallet;
use App\\Models\\WalletLedger;
use Illuminate\\Support\\Facades\\DB;
use Exception;

class WalletRepository implements WalletRepositoryInterface
{
    /**
     * Process internal transfer / Double-Entry transaction between member wallets safely.
     */
    public function transferFunds(int $senderId, int $receiverId, float $amount, string $walletType = 'deposit'): bool
    {
        return DB::transaction(function () use ($senderId, $receiverId, $amount, $walletType) {
            
            // 1. Lock rows to prevent race-conditions on multi-concurrency (FOR UPDATE)
            $senderWallet = Wallet::where('user_id', $senderId)->lockForUpdate()->firstOrFail();
            $receiverWallet = Wallet::where('user_id', $receiverId)->lockForUpdate()->firstOrFail();

            $balanceColumn = $walletType . '_balance';

            if ($senderWallet->$balanceColumn < $amount) {
                throw new Exception("Saldo tidak mencukupi untuk melakukan transfer internal.");
            }

            // 2. Perform credit on sender
            $senderBefore = $senderWallet->$balanceColumn;
            $senderWallet->decrement($balanceColumn, $amount);
            $senderAfter = $senderWallet->fresh()->$balanceColumn;

            WalletLedger::create([
                'wallet_id' => $senderWallet->id,
                'wallet_type' => $walletType,
                'type' => 'credit',
                'amount' => $amount,
                'balance_before' => $senderBefore,
                'balance_after' => $senderAfter,
                'description' => "Transfer internal ke member ID #{$receiverId}"
            ]);

            // 3. Perform debit on receiver
            $receiverBefore = $receiverWallet->$balanceColumn;
            $receiverWallet->increment($balanceColumn, $amount);
            $receiverAfter = $receiverWallet->fresh()->$balanceColumn;

            WalletLedger::create([
                'wallet_id' => $receiverWallet->id,
                'wallet_type' => $walletType,
                'type' => 'debit',
                'amount' => $amount,
                'balance_before' => $receiverBefore,
                'balance_after' => $receiverAfter,
                'description' => "Menerima transfer internal dari member ID #{$senderId}"
            ]);

            return true;
        });
    }
}`
  },
  {
    path: 'app/Jobs/ProcessBinaryPairingBonus.php',
    name: 'ProcessBinaryPairingBonus.php',
    type: 'repository',
    content: `<?php

namespace App\\Jobs;

use App\\Models\\BinaryTree;
use App\\Models\\Commission;
use App\\Models\\Wallet;
use App\\Models\\WalletLedger;
use App\\Models\\BonusSetting;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\DB;

class ProcessBinaryPairingBonus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Executes the daily binary leg pairing matching algorithms.
     * Incorporates carry forwards, pairing ratios, and flush-out limits.
     */
    public function handle(): void
    {
        $setting = BonusSetting::where('id', 'bonus_pairing')->first();
        if (!$setting || !$setting->is_active) {
            return;
        }

        $pairingValue = (float) $setting->value; // E.g., Rp 50.000 per pair
        $maxDailyPairs = (int) ($setting->max_payout_limit ?? 10); // Flush-out limit

        // Fetch all binary nodes that have carry forwards
        $nodes = BinaryTree::where('left_carry_forward', '>', 0)
            ->orWhere('right_carry_forward', '>', 0)
            ->get();

        foreach ($nodes as $node) {
            DB::transaction(function () use ($node, $pairingValue, $maxDailyPairs) {
                // Determine pairing amount (1:1 Ratio standard)
                $left = (float) $node->left_carry_forward;
                $right = (float) $node->right_carry_forward;
                
                $pairs = min($left, $right);
                if ($pairs <= 0) {
                    return;
                }

                // Check daily flush out limit
                $pairsToPay = min($pairs, $maxDailyPairs);
                $flushVolume = $pairs - $pairsToPay;

                // Calculate commissions
                $grossCommission = $pairsToPay * $pairingValue;
                $taxAmount = $grossCommission * 0.05; // 5% standard tax
                $adminFee = $grossCommission * 0.02; // 2% admin fee
                $netCommission = $grossCommission - ($taxAmount + $adminFee);

                if ($netCommission <= 0) {
                    return;
                }

                // Update Carry Forwards
                $node->left_carry_forward = $left - $pairs;
                $node->right_carry_forward = $right - $pairs;
                $node->save();

                // Save Commission Record
                Commission::create([
                    'user_id' => $node->user_id,
                    'bonus_type_id' => 'bonus_pairing',
                    'gross_amount' => $grossCommission,
                    'tax_amount' => $taxAmount,
                    'admin_fee' => $adminFee,
                    'net_amount' => $netCommission,
                    'description' => "Pasangan biner: {$pairsToPay} Pasang. (Flush Out: {$flushVolume} pasang)"
                ]);

                // Update Wallet Balance
                $wallet = Wallet::where('user_id', $node->user_id)->lockForUpdate()->firstOrFail();
                $before = $wallet->bonus_balance;
                $wallet->increment('bonus_balance', $netCommission);

                WalletLedger::create([
                    'wallet_id' => $wallet->id,
                    'wallet_type' => 'bonus',
                    'type' => 'debit',
                    'amount' => $netCommission,
                    'balance_before' => $before,
                    'balance_after' => $wallet->fresh()->bonus_balance,
                    'description' => "Penerimaan Bonus Pasangan Biner (Pairing)"
                ]);
            });
        }
    }
}`
  },
  {
    path: 'app/Http/Controllers/Api/RegistrationController.php',
    name: 'RegistrationController.php',
    type: 'controller',
    content: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use App\\Models\\Sponsor;
use App\\Models\\BinaryTree;
use App\\Models\\Wallet;
use App\\Models\\UserKyc;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Validator;

class RegistrationController extends Controller
{
    /**
     * Register a new member with automatic placement spillover and upline linkage.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'username' => 'required|string|min:4|max:50|unique:users',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'sponsor_username' => 'required|string|exists:users,username',
            'placement_position' => 'required|in:left,right'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $sponsor = User::where('username', $request->sponsor_username)->firstOrFail();

        try {
            $newMember = DB::transaction(function () use ($request, $sponsor) {
                // 1. Create Core User
                $user = User::create([
                    'name' => $request->name,
                    'username' => $request->username,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'status' => 'inactive' // Activates on package purchase
                ]);

                // 2. Link Sponsor (Unilevel Path)
                Sponsor::create([
                    'user_id' => $user->id,
                    'sponsor_id' => $sponsor->id
                ]);

                // 3. Link Wallet
                Wallet::create([
                    'user_id' => $user->id,
                    'bonus_balance' => 0,
                    'deposit_balance' => 0,
                    'reward_balance' => 0
                ]);

                // 4. Find Placement Node using spillover rules (extreme outer left or right)
                $placementParentId = $this->findOuterPlacementNode($sponsor->id, $request->placement_position);

                // 5. Link Binary Tree Node
                BinaryTree::create([
                    'user_id' => $user->id,
                    'parent_id' => $placementParentId,
                    'position' => $request->placement_position,
                    'left_carry_forward' => 0,
                    'right_carry_forward' => 0
                ]);

                return $user;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Registrasi member baru berhasil.',
                'data' => [
                    'id' => $newMember->id,
                    'username' => $newMember->username,
                    'email' => $newMember->email
                ]
            ], 201);

        } catch (\\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Traverses the binary tree downward to find the absolute outer node.
     */
    private function findOuterPlacementNode(int $parentId, string $position): int
    {
        $currentId = $parentId;
        while (true) {
            $child = BinaryTree::where('parent_id', $currentId)
                ->where('position', $position)
                ->first();

            if (!$child) {
                break;
            }
            $currentId = $child->user_id;
        }
        return $currentId;
    }
}`
  },
  {
    path: 'app/Http/Controllers/Installer/InstallSystemController.php',
    name: 'InstallSystemController.php',
    type: 'installer',
    content: `<?php

namespace App\\Http\\Controllers\\Installer;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Artisan;
use Illuminate\\Support\\Facades\\DB;
use Exception;

class InstallSystemController extends Controller
{
    /**
     * Web-based automated cPanel installer.
     * Checks PHP v8.3 extension requirements, tests database connection, and configures .env.
     */
    public function checkRequirements()
    {
        $requirements = [
            'php_version' => PHP_VERSION_ID >= 80300,
            'pdo' => extension_loaded('pdo'),
            'mbstring' => extension_loaded('mbstring'),
            'openssl' => extension_loaded('openssl'),
            'zip' => extension_loaded('zip'),
            'xml' => extension_loaded('xml'),
            'gd' => extension_loaded('gd'),
            'fileinfo' => extension_loaded('fileinfo')
        ];

        $passed = !in_array(false, $requirements, true);

        return view('installer.requirements', compact('requirements', 'passed'));
    }

    /**
     * Validates database credentials and performs automated migrations & seeds.
     */
    public function executeInstallation(Request $request)
    {
        $request->validate([
            'db_host' => 'required|string',
            'db_port' => 'required|numeric',
            'db_name' => 'required|string',
            'db_user' => 'required|string',
            'db_password' => 'nullable|string'
        ]);

        // 1. Test PDO connection
        try {
            $dsn = "mysql:host={$request->db_host};port={$request->db_port};dbname={$request->db_name};charset=utf8mb4";
            new \\PDO($dsn, $request->db_user, $request->db_password, [
                \\PDO::ATTR_ERRMODE => \\PDO::ERRMODE_EXCEPTION,
                \\PDO::ATTR_TIMEOUT => 5
            ]);
        } catch (Exception $e) {
            return back()->withErrors(['connection' => 'Gagal koneksi ke database: ' . $e->getMessage()]);
        }

        // 2. Write details into the server's .env configuration file
        try {
            $this->updateEnvironmentFile($request->all());
        } catch (Exception $e) {
            return back()->withErrors(['env' => 'Gagal menulis berkas .env: ' . $e->getMessage()]);
        }

        // 3. Clear cache, run migrations and database seeders programmatically
        try {
            Artisan::call('config:clear');
            Artisan::call('migrate:fresh', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
            Artisan::call('key:generate', ['--force' => true]);
            Artisan::call('storage:link', ['--force' => true]);
        } catch (Exception $e) {
            return back()->withErrors(['artisan' => 'Proses migrasi & seeder gagal: ' . $e->getMessage()]);
        }

        return redirect()->route('install.complete');
    }

    private function updateEnvironmentFile(array $data): void
    {
        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            copy(base_path('.env.example'), $envPath);
        }

        $envContent = file_get_contents($envPath);

        $replacements = [
            'DB_HOST' => $data['db_host'],
            'DB_PORT' => $data['db_port'],
            'DB_DATABASE' => $data['db_name'],
            'DB_USERNAME' => $data['db_user'],
            'DB_PASSWORD' => $data['db_password'] ?? '',
            'APP_ENV' => 'production',
            'APP_DEBUG' => 'false'
        ];

        foreach ($replacements as $key => $val) {
            $pattern = "/^{$key}=.*/m";
            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, "{$key}=\"{$val}\"", $envContent);
            } else {
                $envContent .= "\\n{$key}=\"{$val}\"";
            }
        }

        file_put_contents($envPath, $envContent);
    }
}`
  },
  {
    path: 'routes/api.php',
    name: 'api.php',
    type: 'route',
    content: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\RegistrationController;
use App\\Http\\Controllers\\Api\\WithdrawalController;
use App\\Http\\Controllers\\Api\\GenealogyController;
use App\\Http\\Controllers\\Api\\ProductShopController;
use App\\Http\\Controllers\\Api\\WalletController;

/*
|--------------------------------------------------------------------------
| REST API Routes with JWT Authentication Safeguard
|--------------------------------------------------------------------------
*/

// Public Authentication & Registration
Route::post('/v1/auth/register', [RegistrationController::class, 'register']);
Route::post('/v1/auth/login', [RegistrationController::class, 'login']);

// Protected Client/Member Routes
Route::middleware('auth:api')->prefix('v1')->group(function () {
    
    // Member Profile & KYC
    Route::get('/member/profile', [RegistrationController::class, 'profile']);
    Route::post('/member/kyc', [RegistrationController::class, 'uploadKyc']);

    // Genealogy Tree Layout
    Route::get('/genealogy/binary/{id?}', [GenealogyController::class, 'getBinaryTree']);
    Route::get('/genealogy/unilevel/{id?}', [GenealogyController::class, 'getUnilevelTree']);
    
    // E-Wallet & Transfers
    Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
    Route::get('/wallet/history', [WalletController::class, 'getMutationHistory']);
    Route::post('/wallet/transfer', [WalletController::class, 'transferInternal']);
    
    // Withdrawals with Transaction PIN Verification
    Route::post('/withdrawal/request', [WithdrawalController::class, 'requestWithdrawal']);
    Route::get('/withdrawal/history', [WithdrawalController::class, 'history']);

    // E-Commerce Store
    Route::get('/shop/products', [ProductShopController::class, 'index']);
    Route::post('/shop/checkout', [ProductShopController::class, 'checkout']);
});`
  },
  {
    path: 'resources/views/installer/requirements.blade.php',
    name: 'requirements.blade.php',
    type: 'view',
    content: `@extends('installer.layout')

@section('title', 'Persyaratan Sistem PHP 8.3')

@section('content')
<div class="card shadow-lg border-0 rounded-4">
    <div class="card-header bg-dark text-white p-4">
        <h4 class="m-0"><i class="fas fa-server me-2 text-warning"></i> Cek Kompatibilitas cPanel</h4>
    </div>
    <div class="card-body p-4">
        <p class="text-muted">Installer mengecek kecocokan server PHP 8.3 dan modul database yang dibutuhkan.</p>
        
        <ul class="list-group list-group-flush mb-4">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                PHP Versi >= 8.3
                <span class="badge {{ $requirements['php_version'] ? 'bg-success' : 'bg-danger' }}">
                    {{ $requirements['php_version'] ? 'Cocok (8.3+)' : 'Gagal' }}
                </span>
            </li>
            @foreach(['pdo' => 'PDO Driver', 'mbstring' => 'Mbstring', 'openssl' => 'OpenSSL Secure Crypt', 'zip' => 'Zip Archive Extractor', 'xml' => 'XML Parser', 'gd' => 'GD Library Image Core'] as $key => $label)
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Modul PHP: {{ $label }}
                    <span class="badge {{ $requirements[$key] ? 'bg-success' : 'bg-danger' }}">
                        {{ $requirements[$key] ? 'Terpasang' : 'Belum Ada' }}
                    </span>
                </li>
            @endforeach
        </ul>

        <div class="d-flex justify-content-between">
            <a href="#" class="btn btn-outline-secondary px-4">Bantuan</a>
            @if($passed)
                <a href="{{ route('install.database') }}" class="btn btn-warning text-dark px-5 fw-bold">Lanjutkan ke Database <i class="fas fa-arrow-right ms-1"></i></a>
            @else
                <button class="btn btn-danger px-5" disabled>Server Tidak Kompatibel</button>
            @endif
        </div>
    </div>
</div>
@endsection`
  }
];
