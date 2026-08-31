<script setup lang="ts">
import { Activity, Loader2, Play, Terminal } from '@lucide/vue';
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const targetHost = ref('8.8.8.8');
const isPinging = ref(false);
const pingResults = ref<any[] | null>(null);
const errorMessage = ref<string | null>(null);

const handlePing = async () => {
    if (!targetHost.value.trim()) return;

    isPinging.value = true;
    pingResults.value = null;
    errorMessage.value = null;

    try {
        const res = await fetch('/routers/ping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                target: targetHost.value,
                count: 4,
            }),
        });

        const data = await res.json();
        if (data.error) {
            errorMessage.value = data.error;
        } else {
            pingResults.value = data.results || [];
        }
    } catch (e: any) {
        errorMessage.value = e.message || 'Ping request failed';
    } finally {
        isPinging.value = false;
    }
};
</script>

<template>
    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
        <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-base font-bold">
                <Terminal class="h-4 w-4 text-blue-500" />
                <span>Router Ping Diagnostic</span>
            </CardTitle>
            <p class="text-xs text-muted-foreground">
                Send ICMP echo packets from the MikroTik router to test uplink latency.
            </p>
        </CardHeader>

        <CardContent class="space-y-3">
            <div class="flex items-center gap-2">
                <Input
                    v-model="targetHost"
                    placeholder="e.g. 8.8.8.8, 1.1.1.1, google.com"
                    class="h-8 text-xs font-mono"
                    @keydown.enter="handlePing"
                />
                <Button
                    size="sm"
                    @click="handlePing"
                    :disabled="isPinging || !targetHost"
                    class="h-8 gap-1.5 text-xs shrink-0"
                >
                    <Loader2 v-if="isPinging" class="h-3.5 w-3.5 animate-spin" />
                    <Play v-else class="h-3.5 w-3.5" />
                    <span>Ping</span>
                </Button>
            </div>

            <div
                v-if="errorMessage"
                class="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive"
            >
                {{ errorMessage }}
            </div>

            <div
                v-if="pingResults"
                class="rounded-lg border bg-zinc-950 p-3 font-mono text-[11px] text-zinc-100 dark:bg-black"
            >
                <div class="mb-2 text-muted-foreground">
                    PING {{ targetHost }} (56 data bytes):
                </div>
                <div
                    v-for="(r, idx) in pingResults"
                    :key="idx"
                    class="flex items-center justify-between py-0.5"
                >
                    <span class="text-emerald-400">
                        64 bytes from {{ r.host || r.address || targetHost }}: seq={{ idx + 1 }} ttl={{ r.ttl || 56 }} time={{ r.time || '10ms' }}
                    </span>
                    <span class="text-[10px] text-zinc-400">{{ r.status || 'OK' }}</span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
