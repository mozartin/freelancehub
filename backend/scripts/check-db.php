<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $dbPath = database_path('database.sqlite');
    echo "Database path: $dbPath\n";
    echo "Database exists: " . (file_exists($dbPath) ? 'YES' : 'NO') . "\n";
    
    if (file_exists($dbPath)) {
        echo "Database size: " . filesize($dbPath) . " bytes\n";
        echo "Database readable: " . (is_readable($dbPath) ? 'YES' : 'NO') . "\n";
        echo "Database writable: " . (is_writable($dbPath) ? 'YES' : 'NO') . "\n";
    }
    
    echo "\nChecking database connection...\n";
    \DB::connection()->getPdo();
    echo "Database connection: OK\n";
    
    echo "\nChecking tables...\n";
    $tables = \DB::select("SELECT name FROM sqlite_master WHERE type='table'");
    echo "Tables found: " . count($tables) . "\n";
    foreach ($tables as $table) {
        echo "  - " . $table->name . "\n";
    }
    
    echo "\nChecking data...\n";
    $userCount = \App\Models\User::count();
    $jobCount = \App\Models\Job::count();
    echo "Users: $userCount\n";
    echo "Jobs: $jobCount\n";
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

