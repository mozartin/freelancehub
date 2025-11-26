<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'freelance_jobs';

    protected $fillable = [
        'client_id',   
        'title',
        'description',
        'skills',
        'budget_type',
        'budget_min',
        'budget_max',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'job_id');
    }
}
