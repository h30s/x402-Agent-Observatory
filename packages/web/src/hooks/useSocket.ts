'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Transaction } from '@/lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(WS_URL, {
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    return { socket: socketRef.current, isConnected };
}

export function useTransactionStream(maxTransactions: number = 50) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { socket, isConnected } = useSocket();

    const addTransaction = useCallback((tx: Transaction) => {
        setTransactions(prev => [tx, ...prev].slice(0, maxTransactions));
    }, [maxTransactions]);

    useEffect(() => {
        if (!socket) return;

        socket.on('transaction', addTransaction);

        return () => {
            socket.off('transaction', addTransaction);
        };
    }, [socket, addTransaction]);

    return { transactions, isConnected, setTransactions };
}
