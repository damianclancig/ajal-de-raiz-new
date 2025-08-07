
'use server';

import { getDb } from './product-service';
import type { AppErrorLog } from './types';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

interface LogErrorData {
    path: string;
    functionName: string;
    errorMessage: string;
    stackTrace?: string;
    metadata?: Record<string, any>;
}

export async function logError(errorData: LogErrorData): Promise<void> {
    try {
        const db = await getDb();
        const logsCollection = db.collection('errorLogs');
        
        const newLogEntry = {
            timestamp: new Date(),
            path: errorData.path,
            functionName: errorData.functionName,
            errorMessage: errorData.errorMessage,
            stackTrace: errorData.stackTrace,
            metadata: errorData.metadata,
            isResolved: false,
        };
        
        await logsCollection.insertOne(newLogEntry);
        console.log('Error logged successfully.');
        revalidatePath('/admin/logs');
    } catch (dbError) {
        console.error('Failed to log error to database:', dbError);
        console.error('Original error details:', errorData);
    }
}

const logFromDoc = (doc: any): AppErrorLog | null => {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        timestamp: doc.timestamp.toISOString(),
        path: doc.path,
        functionName: doc.functionName,
        errorMessage: doc.errorMessage,
        stackTrace: doc.stackTrace,
        metadata: doc.metadata,
        isResolved: doc.isResolved || false,
    };
};

export async function getAllLogs(): Promise<AppErrorLog[]> {
    try {
        const db = await getDb();
        const logsCollection = db.collection('errorLogs');
        const logs = await logsCollection.find({}).sort({ timestamp: -1 }).toArray();
        return logs.map(logFromDoc).filter((log): log is AppErrorLog => log !== null);
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        return [];
    }
}

export async function toggleLogResolvedStatus(logId: string): Promise<{success: boolean, message: string}> {
    if (!ObjectId.isValid(logId)) return { success: false, message: 'Invalid log ID.'};
    
    try {
        const db = await getDb();
        const logsCollection = db.collection('errorLogs');
        const log = await logsCollection.findOne({ _id: new ObjectId(logId) });
        if (!log) return { success: false, message: 'Log not found.' };

        const newStatus = !log.isResolved;
        await logsCollection.updateOne({ _id: new ObjectId(logId) }, { $set: { isResolved: newStatus } });
        
        revalidatePath('/admin/logs');
        return { success: true, message: `Log status updated to ${newStatus ? 'resolved' : 'unresolved'}`};
    } catch (error) {
        console.error("Failed to update log status:", error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, message };
    }
}

export async function clearAllLogs(): Promise<{success: boolean, message: string}> {
    try {
        const db = await getDb();
        const logsCollection = db.collection('errorLogs');
        await logsCollection.deleteMany({});
        revalidatePath('/admin/logs');
        return { success: true, message: 'All logs have been cleared.' };
    } catch (error) {
        console.error("Failed to clear logs:", error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, message };
    }
}
