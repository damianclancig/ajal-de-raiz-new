
import { getAllLogs } from '@/lib/log-service';
import LogsClientPage from './_components/logs-client-page';

export const revalidate = 0;

export default async function AdminLogsPage() {
    const logs = await getAllLogs();
    
    return <LogsClientPage logs={logs} />
}
