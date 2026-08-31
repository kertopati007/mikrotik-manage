<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    CheckCircle2,
    Edit2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Plus,
    Power,
    Search,
    ShieldAlert,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    X,
    XCircle,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import PPPSecretModal from '@/components/ppp/PPPSecretModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PPPProfile, PPPSecret } from '@/types/router';

const props = defineProps<{
    secrets: PPPSecret[];
    profiles?: PPPProfile[];
}>();

const searchQuery = ref('');
const selectedService = ref<string>('all');
const isModalOpen = ref(false);
const editingSecret = ref<PPPSecret | null>(null);
const visiblePasswords = ref<Record<string, boolean>>({});
const actionInProgress = ref<string | null>(null);

const togglePasswordVisibility = (id: string) => {
    visiblePasswords.value[id] = !visiblePasswords.value[id];
};

const filteredSecrets = computed(() => {
    return props.secrets.filter((secret) => {
        const matchesSearch =
            !searchQuery.value ||
            secret.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (secret.comment && secret.comment.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
            (secret['remote-address'] && secret['remote-address'].includes(searchQuery.value));

        const matchesService =
            selectedService.value === 'all' ||
            (secret.service || '').toLowerCase() === selectedService.value.toLowerCase();

        return matchesSearch && matchesService;
    });
});

const getServiceBadgeClass = (service?: string) => {
    const s = (service || '').toLowerCase();
    if (s === 'pppoe') return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    if (s === 'l2tp') return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    if (s === 'pptp') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (s === 'sstp') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (s === 'ovpn') return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
};

const openAddModal = () => {
    editingSecret.value = null;
    isModalOpen.value = true;
};

const openEditModal = (secret: PPPSecret) => {
    editingSecret.value = secret;
    isModalOpen.value = true;
};

const handleToggleDisable = (secret: PPPSecret) => {
    const secretId = secret['.id'] || secret.name;
    const isDisabled = secret.disabled === 'true' || secret.disabled === true;
    const action = isDisabled ? 'enable' : 'disable';

    actionInProgress.value = secretId;

    router.post(
        `/ppp/secret/${encodeURIComponent(secretId)}/toggle`,
        { enable: isDisabled },
        {
            preserveScroll: true,
            onFinish: () => {
                actionInProgress.value = null;
            },
        }
    );
};

const handleDelete = (secret: PPPSecret) => {
    const secretId = secret['.id'] || secret.name;
    if (!confirm(`Are you sure you want to delete PPP secret "${secret.name}"?`)) {
        return;
    }

    actionInProgress.value = secretId;

    router.delete(`/ppp/secret/${encodeURIComponent(secretId)}`, {
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
                    <KeyRound class="h-4 w-4 text-primary" />
                    <span>PPP Secrets (Users)</span>
                    <Badge variant="secondary" class="font-mono text-xs">
                        {{ filteredSecrets.length }} users
                    </Badge>
                </CardTitle>

                <div class="flex flex-wrap items-center gap-2">
                    <!-- Search & Filter -->
                    <div class="relative w-full sm:w-48">
                        <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search secret user..."
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

                    <select
                        v-model="selectedService"
                        class="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                    >
                        <option value="all">All Services</option>
                        <option value="pppoe">PPPoE</option>
                        <option value="l2tp">L2TP</option>
                        <option value="pptp">PPTP</option>
                        <option value="sstp">SSTP</option>
                        <option value="ovpn">OpenVPN</option>
                    </select>

                    <!-- Add User Button -->
                    <Button size="sm" class="h-8 gap-1.5 text-xs font-semibold" @click="openAddModal">
                        <Plus class="h-3.5 w-3.5" />
                        <span>Add PPP User</span>
                    </Button>
                </div>
            </div>
        </CardHeader>

        <CardContent class="p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th class="py-2.5 pl-4 pr-3">User / Name</th>
                            <th class="px-3 py-2.5">Password</th>
                            <th class="px-3 py-2.5">Service</th>
                            <th class="px-3 py-2.5">Profile</th>
                            <th class="px-3 py-2.5">Remote Address</th>
                            <th class="px-3 py-2.5">Comment</th>
                            <th class="px-3 py-2.5">Status</th>
                            <th class="py-2.5 pl-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr v-if="filteredSecrets.length === 0">
                            <td colspan="8" class="py-8 text-center text-muted-foreground">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <Users class="h-8 w-8 text-muted-foreground/40" />
                                    <p class="text-xs font-medium">No PPP Secret users configured</p>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-for="secret in filteredSecrets"
                            :key="secret['.id'] || secret.name"
                            class="hover:bg-muted/30 transition-colors"
                            :class="{
                                'opacity-60 bg-muted/20': secret.disabled === 'true' || secret.disabled === true
                            }"
                        >
                            <!-- Name -->
                            <td class="py-2.5 pl-4 pr-3 font-semibold text-foreground font-mono">
                                {{ secret.name }}
                            </td>

                            <!-- Password with toggle -->
                            <td class="px-3 py-2.5 font-mono">
                                <div class="flex items-center gap-1.5">
                                    <span v-if="visiblePasswords[secret['.id'] || secret.name]" class="text-primary font-bold">
                                        {{ secret.password || '(empty)' }}
                                    </span>
                                    <span v-else class="text-muted-foreground">••••••••</span>
                                    <button
                                        type="button"
                                        @click="togglePasswordVisibility(secret['.id'] || secret.name)"
                                        class="text-muted-foreground hover:text-foreground p-0.5"
                                    >
                                        <EyeOff v-if="visiblePasswords[secret['.id'] || secret.name]" class="h-3 w-3" />
                                        <Eye v-else class="h-3 w-3" />
                                    </button>
                                </div>
                            </td>

                            <!-- Service -->
                            <td class="px-3 py-2.5">
                                <Badge variant="outline" :class="getServiceBadgeClass(secret.service)" class="uppercase font-mono text-[10px]">
                                    {{ secret.service || 'any' }}
                                </Badge>
                            </td>

                            <!-- Profile -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                <Badge variant="secondary" class="text-[10px] font-mono">
                                    {{ secret.profile || 'default' }}
                                </Badge>
                            </td>

                            <!-- Remote Address -->
                            <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                {{ secret['remote-address'] || '-' }}
                            </td>

                            <!-- Comment -->
                            <td class="px-3 py-2.5 text-muted-foreground truncate max-w-[160px]">
                                {{ secret.comment || '-' }}
                            </td>

                            <!-- Status -->
                            <td class="px-3 py-2.5">
                                <Badge
                                    v-if="secret.disabled === 'true' || secret.disabled === true"
                                    variant="outline"
                                    class="border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-[10px]"
                                >
                                    Disabled
                                </Badge>
                                <Badge
                                    v-else
                                    variant="outline"
                                    class="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px]"
                                >
                                    Enabled
                                </Badge>
                            </td>

                            <!-- Actions -->
                            <td class="py-2.5 pl-3 pr-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <!-- Enable/Disable -->
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 w-7 p-0"
                                        :title="secret.disabled === 'true' || secret.disabled === true ? 'Enable Secret' : 'Disable Secret'"
                                        :disabled="actionInProgress === (secret['.id'] || secret.name)"
                                        @click="handleToggleDisable(secret)"
                                    >
                                        <Power
                                            class="h-3.5 w-3.5"
                                            :class="secret.disabled === 'true' || secret.disabled === true ? 'text-emerald-500' : 'text-amber-500'"
                                        />
                                    </Button>

                                    <!-- Edit -->
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                        title="Edit Secret"
                                        @click="openEditModal(secret)"
                                    >
                                        <Edit2 class="h-3.5 w-3.5" />
                                    </Button>

                                    <!-- Delete -->
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 w-7 p-0 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                                        title="Delete Secret"
                                        :disabled="actionInProgress === (secret['.id'] || secret.name)"
                                        @click="handleDelete(secret)"
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
    <PPPSecretModal
        :open="isModalOpen"
        :secret="editingSecret"
        :profiles="profiles"
        @close="isModalOpen = false"
    />
</template>
