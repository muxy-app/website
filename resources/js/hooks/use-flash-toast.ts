import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashShape = {
    toast?: FlashToast;
    success?: string | null;
    error?: string | null;
};

export function useFlashToast(): void {
    const seen = useRef<string | null>(null);

    useEffect(() => {
        const offNavigate = router.on('navigate', (event) => {
            const page = (event as CustomEvent).detail?.page;
            const flash = page?.props?.flash as FlashShape | undefined;

            if (!flash) {
                return;
            }

            const key = `${page?.url ?? ''}|${flash.success ?? ''}|${flash.error ?? ''}`;

            if (seen.current === key) {
                return;
            }

            seen.current = key;

            if (flash.success) {
                toast.success(flash.success);
            }

            if (flash.error) {
                toast.error(flash.error);
            }
        });

        const offFlash = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as
                | FlashShape
                | undefined;

            if (flash?.toast) {
                toast[flash.toast.type](flash.toast.message);
            }
        });

        return () => {
            offNavigate();
            offFlash();
        };
    }, []);
}
