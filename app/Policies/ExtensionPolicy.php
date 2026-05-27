<?php

namespace App\Policies;

use App\Models\Extension;
use App\Models\User;

class ExtensionPolicy
{
    public function before(User $user): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function view(User $user, Extension $extension): bool
    {
        return $extension->user_id === $user->id;
    }

    public function update(User $user, Extension $extension): bool
    {
        return $extension->user_id === $user->id;
    }

    public function delete(User $user, Extension $extension): bool
    {
        return $extension->user_id === $user->id;
    }
}
