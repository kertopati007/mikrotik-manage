<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Clock,
    Flame,
    ListFilter,
    Loader2,
    Plus,
    Save,
    Shield,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FirewallAddressList } from '@/types/router';

const props = defineProps<{
    open: boolean;
    entryToEdit?: FirewallAddressList | null;
    existingLists?: string[];
}>();

const emit = defineEmits<{
    (e: 'update:open', val: boolean): void;
    (e: 'saved'): void;
}>();

const isSubmitting = ref(false);
const isEditing = computed(() => !!props.entryToEdit);
const isCustomList = ref(false);

const form = ref({
    list: 'Admin_WhiteList',
    custom_list: '',
    address: '',
    timeout: '',
    comment: '',
    disabled: false,
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            if (props.entryToEdit) {
                const e = props.entryToEdit;
                form.value = {
                    list: e.list || '',
                    custom_list: '',
                    address: e.address || '',
                    timeout: e.timeout || '',
                    comment: e.comment || '',
                    disabled: e.disabled === 'true' || e.disabled === true,
                };
                isCustomList.value = false;
            } else {
                form.value = {
                    list: props.existingLists?.[0] || 'Admin_WhiteList',
                    custom_list: '',
                    address: '',
                    timeout: '',
                    comment: '',
                    disabled: false,
                };
                isCustomList.value = !props.existingLists?.length;
            }
        }
    }
);

const handleSubmit = () => {
    isSubmitting.value = true;
    const finalListName = isCustomList.value ? form.value.custom_list.trim() : form.value.list;

    const payload = {
        list: finalListName,
        address: form.value.address.trim(),
        timeout: form.value.timeout ? form.value.timeout.trim() : undefined,
        comment: form.value.comment ? form.value.comment.trim() : undefined,
        disabled: form.value.disabled,
    };

    const url = isEditing.value
        ? `/firewall/address-list/${props.entryToEdit?.['.id'] || ''}`
        : '/firewall/address-list';
    const method = isEditing.value ? 'put' : 'post';

    router[method](url, payload, {
        preserveScroll: true,
        onSuccess: () => {
            emit('update:open', false);
            emit('saved');
        },
        onFinish: () => {
            isSubmitting.value = false;
        },
    });
};
</script>

<template>
    <Dialog :open="open" @update:open="emit('update:open', $event)">
        <DialogContent class="sm:max-w-[480px]">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                        <ListFilter class="h-5 w-5" />
                    </div>
                    <div>
                        <DialogTitle class="text-base font-bold">
                            {{ isEditing ? 'Edit Address List Entry' : 'Add IP to Address List' }}
                        </DialogTitle>
                        <DialogDescription class="text-xs text-muted-foreground">
                            Group IP addresses, subnets, or hostnames into reusable firewall lists.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4 py-2 text-xs">
                <!-- List Name Selector -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <Label class="font-semibold text-foreground">List Name *</Label>
                        <button
                            v-if="existingLists && existingLists.length > 0"
                            type="button"
                            @click="isCustomList = !isCustomList"
                            class="text-[11px] font-medium text-primary hover:underline"
                        >
                            {{ isCustomList ? 'Select Existing List' : '+ Create New List Name' }}
                        </button>
                    </div>

                    <Input
                        v-if="isCustomList || !existingLists?.length"
                        v-model="form.custom_list"
                        placeholder="e.g. Blocked_Scanners, VIP_Users, LAN_Servers"
                        class="h-8 text-xs font-mono"
                        required
                    />

                    <select
                        v-else
                        v-model="form.list"
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                        required
                    >
                        <option
                            v-for="l in existingLists"
                            :key="l"
                            :value="l"
                        >
                            {{ l }}
                        </option>
                    </select>
                </div>

                <!-- IP Address / Subnet / FQDN -->
                <div class="space-y-1.5">
                    <Label class="font-semibold text-foreground">Address / Subnet / Hostname *</Label>
                    <Input
                        v-model="form.address"
                        placeholder="e.g. 192.168.88.50 or 10.0.0.0/8 or google.com"
                        class="h-8 text-xs font-mono"
                        required
                    />
                    <p class="text-[10px] text-muted-foreground">
                        Supports single IP (e.g. 1.2.3.4), CIDR subnet (e.g. 192.168.1.0/24), or DNS domain.
                    </p>
                </div>

                <!-- Timeout -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <Label class="font-semibold text-foreground">Timeout (Optional)</Label>
                        <span class="text-[10px] text-muted-foreground">Blank = Permanent</span>
                    </div>
                    <div class="relative">
                        <Input
                            v-model="form.timeout"
                            placeholder="e.g. 1d 00:00:00 or 02:00:00"
                            class="h-8 text-xs font-mono pl-8"
                        />
                        <Clock class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <!-- Comment -->
                <div class="space-y-1.5">
                    <Label class="font-semibold text-foreground">Comment</Label>
                    <Input
                        v-model="form.comment"
                        placeholder="e.g. Office Admin Workstation"
                        class="h-8 text-xs"
                    />
                </div>

                <!-- Checkbox disabled -->
                <div class="flex items-center space-x-2 rounded-lg border bg-muted/30 p-2.5">
                    <Checkbox
                        id="addr-disabled"
                        :checked="form.disabled"
                        @update:checked="form.disabled = $event"
                    />
                    <Label for="addr-disabled" class="cursor-pointer font-medium">
                        Disable this Entry
                    </Label>
                </div>

                <DialogFooter class="flex items-center justify-between gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="emit('update:open', false)"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        :disabled="isSubmitting"
                        class="gap-1.5"
                    >
                        <Loader2 v-if="isSubmitting" class="h-3.5 w-3.5 animate-spin" />
                        <Save v-else class="h-3.5 w-3.5" />
                        <span>{{ isEditing ? 'Save Entry' : 'Add to List' }}</span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
