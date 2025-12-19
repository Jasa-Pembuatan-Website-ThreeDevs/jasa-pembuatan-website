<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
// Note: Spatie classes are referenced below only when the package/migrations exist
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update admin user first (safe even if spatie not installed)
        $adminEmail = env('ADMIN_EMAIL', 'threedevs@admin.com');
        $adminPassword = env('ADMIN_PASSWORD', 'threedevsJagoKoding');

        $user = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Administrator',
                'password' => Hash::make($adminPassword),
            ]
        );

        // If Spatie tables are not published/migrated yet, skip role/permission creation to avoid SQL errors
        if (!Schema::hasTable('permissions') || !Schema::hasTable('roles') || !class_exists('\Spatie\Permission\Models\Permission') || !class_exists('\Spatie\Permission\Models\Role')) {
            Log::warning('Spatie permission tables or classes not found - skipping role/permission creation in AdminSeeder. Run vendor:publish and migrate to enable.');
            return;
        }

        // Create basic permissions (add as needed)
        $permissions = [
            'view dashboard',
            'manage orders',
            'manage expenses',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Create admin role and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);

        // Assign role to user
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('admin');
        }
    }
}
