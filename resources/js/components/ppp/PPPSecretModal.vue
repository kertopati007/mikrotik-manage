<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { Eye, EyeOff, KeyRound, Loader2, UserPlus, X } from '@lucide/vue';
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PPPProfile, PPPSecret } from '@/types/router';

const props = defineProps<{
    open: boolean;
    secret?: PPPSecret | null;
    profiles?: PPPProfile[];
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const showPassword = ref(false);

const form = useForm({
    name: '',
    password: '',
    service: 'any',
    profile: 'default',
    local_address: '',
    remote_address: '',
    comment: '',
    disabled: false,
});

watch(
    () => props.secret,
    (newSecret) => {
        if (newSecret) {
            form.name = newSecret.name || '';
            form.password = newSecret.password || '';
            form.service = newSecret.service || 'any';
            form.profile = newSecret.profile || 'default';
            form.local_address = newSecret['local-address'] || '';
            form.remote_address = newSecret['remote-address'] || '';
            form.comment = newSecret.comment || '';
            form.disabled = newSecret.disabled === 'true' || newSecret.disabled === true;
        } else {
            form.reset();
            form.service = 'any';
            form.profile = 'default';
            form.disabled = false;
        }
    },
    { immediate: true }
);

const handleSubmit = () => {
    if (props.secret && props.secret['.id']) {
        const id = props.secret['.id'];
        form.put(`/ppp/secret/${encodeURIComponent(id)}`, {
            preserveScroll: true,
            onSuccess: () => {
                emit('close');
            },
        });
    } else {
        form.post('/ppp/secret', {
            preserveScroll: true,
            onSuccess: () => {
                emit('close');
                form.reset();
            },
        });
    }
};
</script>

<template>
    <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-all"
    >
        <Card class="w-full max-w-lg border-border/80 bg-card shadow-2xl">
            <CardHeader class="flex flex-row items-center justify-between border-b pb-3">
                <CardTitle class="flex items-center gap-2 text-base font-bold">
                    <UserPlus class="h-4 w-4 text-primary" />
                    <span>{{ secret ? 'Edit PPP Secret User' : 'Add New PPP Secret User' }}</span>
                </CardTitle>
                <button
                    @click="emit('close')"
                    class="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden"
                >
                    <X class="h-4 w-4" />
                </button>
            </CardHeader>

            <CardContent class="pt-4">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Username & Password -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Username / Name *</label>
                            <Input
                                v-model="form.name"
                                type="text"
                                required
                                placeholder="e.g. pppoe_user_home"
                                class="h-8 text-xs font-mono"
                            />
                            <p v-if="form.errors.name" class="text-[11px] text-destructive">
                                {{ form.errors.name }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">
                                Password {{ secret ? '(Optional)' : '*' }}
                            </label>
                            <div class="relative">
                                <Input
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    :required="!secret"
                                    placeholder="Enter password"
                                    class="h-8 pr-8 text-xs font-mono"
                                />
                                <button
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                                >
                                    <EyeOff v-if="showPassword" class="h-3.5 w-3.5" />
                                    <Eye v-else class="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <p v-if="form.errors.password" class="text-[11px] text-destructive">
                                {{ form.errors.password }}
                            </p>
                        </div>
                    </div>

                    <!-- Service & Profile -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Service</label>
                            <select
                                v-model="form.service"
                                class="h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring font-mono"
                            >
                                <option value="any">any</option>
                                <option value="pppoe">pppoe</option>
                                <option value="l2tp">l2tp</option>
                                <option value="pptp">pptp</option>
                                <option value="sstp">sstp</option>
                                <option value="ovpn">ovpn</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Profile</label>
                            <select
                                v-model="form.profile"
                                class="h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring font-mono"
                            >
                                <option value="default">default</option>
                                <option value="default-encryption">default-encryption</option>
                                <template v-if="profiles && profiles.length > 0">
                                    <option
                                        v-for="p in profiles.filter(pr => pr.name !== 'default' && pr.name !== 'default-encryption')"
                                        :key="p['.id'] || p.name"
                                        :value="p.name"
                                    >
                                        {{ p.name }} {{ p['rate-limit'] ? `(${p['rate-limit']})` : '' }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <!-- Local & Remote Address -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Local Address (Optional)</label>
                            <Input
                                v-model="form.local_address"
                                type="text"
                                placeholder="e.g. 10.0.0.1"
                                class="h-8 text-xs font-mono"
                            />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-muted-foreground">Remote Address (Optional)</label>
                            <Input
                                v-model="form.remote_address"
                                type="text"
                                placeholder="e.g. 100.64.0.10"
                                class="h-8 text-xs font-mono"
                            />
                        </div>
                    </div>

                    <!-- Comment -->
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-muted-foreground">Comment / Note</label>
                        <Input
                            v-model="form.comment"
                            type="text"
                            placeholder="e.g. Home internet package 10 Mbps"
                            class="h-8 text-xs"
                        />
                    </div>

                    <!-- Disabled Checkbox -->
                    <div class="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="disabled"
                            v-model="form.disabled"
                            class="h-4 w-4 rounded-xs border-input text-primary focus:ring-primary"
                        />
                        <label for="disabled" class="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                            Disable user account (Isolir / Non-aktifkan)
                        </label>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-2 pt-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="h-8 text-xs"
                            @click="emit('close')"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            size="sm"
                            class="h-8 text-xs font-semibold"
                            :disabled="form.processing"
                        >
                            <Loader2 v-if="form.processing" class="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            <span>{{ secret ? 'Save Changes' : 'Create PPP User' }}</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
