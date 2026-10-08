import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Activity,
  BarChart3,
  ClipboardCheck,
  RefreshCw,
} from 'lucide-react';
import { api, SecurityPosture, GuardDutyFinding, MisconfigurationItem, SecurityHubFinding } from '../services/api';
import { useWebSocket } from '../contexts/WebSocketContext';

export function ProactiveCompliance() {
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [findings, setFindings] = useState<GuardDutyFinding[]>([]);
  const [hubFindings, setHubFindings] = useState<SecurityHubFinding[]>([]);
  const [loading, setLoading] = useState(false);
  const [remediating, setRemediating] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const { sendNotification } = useWebSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, f, sh] = await Promise.all([
        api.getSecurityPosture(),
        api.getGuardDutyFindings(),
        api.getSecurityHubFindings(),
      ]);
      setPosture(p);
      setFindings(f);
      setHubFindings(sh);
      toast.success('Compliance data refreshed');
    } catch (err) {
      console.error('Failed to load compliance data:', err);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const remediate = async (item: MisconfigurationItem) => {
    setRemediating(prev => ({ ...prev, [item.resourceId]: true }));
    try {
      const res = await api.remediateIssue({ type: item.type, resourceId: item.resourceId });
      // Optimistically mark as fixed by removing from list
      setPosture(prev => prev ? { ...prev, misconfigurations: prev.misconfigurations.filter(m => m.resourceId !== item.resourceId) } : prev);
      console.log('Remediation result:', res);
      toast.success('Remediation triggered successfully');
      // Push remediation confirmation into Notification Center
      const details = res?.details || `Fix initiated for ${item.type} on ${item.resourceId}`;
      const isDryRun = typeof details === 'string' && details.toLowerCase().includes('dry-run');
      sendNotification({
        title: isDryRun ? 'Remediation dry-run' : 'Remediation triggered',
        message: details,
        type: isDryRun ? 'info' : 'success',
        read: false,
      });
    } catch (err) {
      console.error('Remediation failed:', err);
      toast.error('Remediation failed');
      // Push failure notification
      sendNotification({
        title: 'Remediation failed',
        message: (err as any)?.message ? String((err as any).message) : 'Unknown error during remediation',
        type: 'error',
        read: false,
      });
    } finally {
      setRemediating(prev => ({ ...prev, [item.resourceId]: false }));
    }
  };

  const filteredMisconfigs = (posture?.misconfigurations || []).filter(m => filter === 'all' || m.severity === filter);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Shield className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Proactive Compliance & Security Automation</h1>
            <p className="text-muted-foreground text-sm">Continuous posture monitoring, automated triage, and remediation</p>
          </div>
        </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={loadData} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Badge variant="outline" className="ml-2">
          Data: {import.meta.env.VITE_API_BASE_URL ? 'Backend' : 'Mock'}
        </Badge>
      </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compliant Controls</p>
              <p className="text-2xl font-bold">{posture?.summary.compliant ?? 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
              <p className="text-2xl font-bold">{posture?.summary.nonCompliant ?? 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Partially Compliant</p>
              <p className="text-2xl font-bold">{posture?.summary.partiallyCompliant ?? 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frameworks</p>
              <p className="text-2xl font-bold">{posture?.frameworks.length ?? 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Misconfigurations with Remediation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Remediation Candidates
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredMisconfigs.length} issues</Badge>
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {filteredMisconfigs.map((m) => (
            <div key={`${m.type}-${m.resourceId}`} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{m.type}</Badge>
                  <span className="text-sm font-medium">{m.resourceId}</span>
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={
                  m.severity === 'critical' ? 'bg-red-600' :
                  m.severity === 'high' ? 'bg-orange-600' :
                  m.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                }>{m.severity}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!m.fixAvailable || remediating[m.resourceId]}
                  onClick={() => remediate(m)}
                >
                  {remediating[m.resourceId] ? 'Remediating...' : 'Remediate'}
                </Button>
              </div>
            </div>
          ))}
          {filteredMisconfigs.length === 0 && (
            <p className="text-sm text-muted-foreground">No remediation candidates for selected filter.</p>
          )}
        </div>
      </Card>

      {/* Compliance Controls Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Compliance Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(posture?.items || []).map((item) => (
            <div key={item.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{item.framework}</Badge>
                  <span className="text-sm font-medium">{item.control}</span>
                </div>
                <Badge className={
                  item.status === 'compliant' ? 'bg-green-600' :
                  item.status === 'partially_compliant' ? 'bg-yellow-600' : 'bg-red-600'
                }>
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
              {item.description && (
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              )}
              {item.remediation && (
                <p className="mt-1 text-xs">Remediation: {item.remediation}</p>
              )}
              {item.resourceId && (
                <p className="mt-1 text-xs text-muted-foreground">Resource: {item.resourceId}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* GuardDuty Findings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3">Amazon GuardDuty Findings</h2>
        <div className="space-y-3">
          {findings.map((f) => (
            <div key={f.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{f.type}</Badge>
                    {f.title && <span className="text-sm font-medium">{f.title}</span>}
                  </div>
                  {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                  <p className="text-xs text-muted-foreground">Resource: {f.resource}</p>
                </div>
                <Badge className={
                  f.severity >= 7 ? 'bg-red-600' :
                  f.severity >= 4 ? 'bg-orange-600' :
                  f.severity >= 1 ? 'bg-yellow-600' : 'bg-green-600'
                }>
                  Sev {f.severity}
                </Badge>
              </div>
              {f.recommendation && (
                <p className="mt-2 text-xs">Recommendation: {f.recommendation}</p>
              )}
            </div>
          ))}
          {findings.length === 0 && (
            <p className="text-sm text-muted-foreground">No GuardDuty findings.</p>
          )}
        </div>
      </Card>

      {/* Security Hub Findings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3">AWS Security Hub Findings</h2>
        <div className="space-y-3">
          {hubFindings.map((f) => (
            <div key={f.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {f.productArn && (
                      <Badge variant="outline" className="text-xs">{f.productArn.split(':').slice(-1)[0]}</Badge>
                    )}
                    {f.title && <span className="text-sm font-medium">{f.title}</span>}
                  </div>
                  {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                  {f.resource && <p className="text-xs text-muted-foreground">Resource: {f.resource}</p>}
                  {f.complianceStatus && <p className="text-xs">Compliance: {f.complianceStatus}</p>}
                </div>
                <Badge className={
                  (f.severity ?? 0) >= 7 ? 'bg-red-600' :
                  (f.severity ?? 0) >= 4 ? 'bg-orange-600' :
                  (f.severity ?? 0) >= 1 ? 'bg-yellow-600' : 'bg-green-600'
                }>
                  Sev {f.severity ?? 0}
                </Badge>
              </div>
            </div>
          ))}
          {hubFindings.length === 0 && (
            <p className="text-sm text-muted-foreground">No Security Hub findings.</p>
          )}
        </div>
      </Card>
    </div>
  );
}