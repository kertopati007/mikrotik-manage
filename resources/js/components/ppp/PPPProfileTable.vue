<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Edit2,
    Gauge,
    Loader2,
    Network,
    Plus,
    Search,
    Sliders,
    Trash2,
    X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import PPPProfileModal from '@/components/ppp/PPPProfileModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PPPProfile } from '@/types/router';

const props = defineProps<{
    profiles: PPPProfile[];
}>();

const searchQuery = ref('');
const isModalOpen = ref(false);
const editingProfile = ref<PPPProfile | null>(null);
const actionInProgress = ref<string | null>(null);

const filteredProfiles = computed(() => {
    return props.profiles.filter((profile) => {
        return (
            !searchQuery.value ||
            profile.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (profile.comment && profile.comment.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
            (profile['rate-limit'] && profile['rate-limit'].toLowerCase().includes(searchQuery.value.toLowerCase()))
        );
    });
});

const openAddModal = () => {
    editingProfile.value = null;
    isModalOpen.value = true;
};

const openEditModal = (profile: PPPProfile) => {
    editingProfile.value = profile;
    isModalOpen.value = true;
};

const handleDelete = (profile: PPPProfile) => {
    const profileId = profile['.id'] || profile.name;
    if (profile.name === 'default' || profile.name === 'default-encryption') {
        alert('Built-in system profiles (default, default-encryption) cannot be deleted.');
        return;
    }

    if (!confirm(`Are you sure you want to delete PPP profile "${profile.name}"?`)) {
        return;
    }

    actionInProgress.value = profileId;

    router.delete(`/ppp/profile/${encodeURIComponent(profileId)}`, {
        preserveScroll: true,
        onFinish: () => {
            actionInProgress.value = null;
        },
    });
};
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <Sliders class="h-4 w-4 text-amber-500" />
                    <span>PPP Profiles</span>
                    <Badge variant="secondary" class="font-mono text-xs">
                        {{ filteredProfiles.length }} profiles
                    </Badge>
                </CardTitle>

                <div class="flex items-center gap-2">
                    <!-- Search -->
                    <div class="relative w-full sm:w-48">
                        <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search profile name / rate..."
                            class="h-8 pl-8 text-xs"
                        />
                        <button
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X class="h-3 w-3" />
                        </button>
                    </div>

                    <!-- Add Profile Button -->
                    <Button size="sm" class="h-8 gap-1.5 text-xs font-semibold" @click="openAddModal">
                        <Plus class="h-3.5 w-3.5" />
                        <span>Add PPP Profile</span>
                    </Button>
                </div>
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-3">Profile Name</th>
                            <th class="px-3 py-2.5">Rate Limit (Rx/Tx)</th>
                            <th class="px-3 py-2.5">Local Address</th>
                            <th class="px-3 py-2.5">Remote Address</th>
                            <th class="px-3 py-2.5">DNS Server</th>
                            <th class="px-3 py-2.5">Only One</th>
                            <th class="px-3 py-2.5">Comment</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr v-if="filteredProfiles.length === 0">
                            <td colspan="8" class="py-8 text-center text-muted-foreground">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <Sliders class="h-8 w-8 text-muted-foreground/40" />
                                    <p class="text-xs font-medium">No PPP Profiles found</p>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-for="profile in filteredProfiles"
                            :key="profile['.id'] || profile.name"
                            class="hover:bg-muted/30 transition-colors"
                        >
                            <!-- Profile Name -->
                            <td class="py-2.5 pl-4 pr-3 font-semibold text-foreground font-mono">
                                <div class="flex items-center gap-2">
                                    <span>{{ profile.name }}</span>
                                    <Badge
                                        v-if="profile.name === 'default' || profile.name === 'default-encryption'"
                                        variant="outline"
                                        class="h-4 px-1 text-[9px] border-blue-500/40 text-blue-600 dark:text-blue-400"
                                    >
                                        BUILT-IN
                                    </Badge>
                                </div>
                            </td>

                            <!-- Rate Limit -->
                            <td class="px-3 py-2.5 font-mono">
                                <Badge
                                    v-if="profile['rate-limit']"
                                    variant="outline"
                                    class="border-amber-500/40 text-amber-600 dark:text-amber-400 font-mono text-[10px]"
                                >
                                    {{ profile['rate-limit'] }}
                                </Badge>
                                <span v-else class="text-muted-foreground text-[11px]">Unlimited</span>
                            </td>

                            <!-- Local Address -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                {{ profile['local-address'] || '-' }}
                            </td>

                            <!-- Remote Address -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                {{ profile['remote-address'] || '-' }}
                            </td>

                            <!-- DNS Server -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                {{ profile['dns-server'] || '-' }}
                            </td>

                            <!-- Only One -->
                            <td class="px-3 py-2.5 text-muted-foreground font-mono">
                                {{ profile['only-one'] || 'default' }}
                            </td>

                            <!-- Comment -->
                            <td class="px-3 py-2.5 text-muted-foreground truncate max-w-[160px]">
                                {{ profile.comment || '-' }}
                            </td>

                            <!-- Actions -->
                            <td class="py-2.5 pl-3 pr-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <!-- Edit -->
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                        title="Edit Profile"
                                        @click="openEditModal(profile)"
                                    >
                                        <Edit2 class="h-3.5 w-3.5" />
                                    </Button>

                                    <!-- Delete -->
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 w-7 p-0 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                                        title="Delete Profile"
                                        :disabled="
                                            profile.name === 'default' ||
                                            profile.name === 'default-encryption' ||
                                            actionInProgress === (profile['.id'] || profile.name)
                                        "
                                        @click="handleDelete(profile)"
                                    >
                                        <Trash2 class="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>

    <!-- Modal Form -->
    <PPPProfileModal
        :open="isModalOpen"
        :profile="editingProfile"
        @close="isModalOpen = false"
    />
</template>
