<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'freelance_jobs';

    protected $fillable = [
        'title',
        'description',
        'skills',
        'budget_type',
        'budget_min',
        'budget_max',
        'status',
    ];
}
