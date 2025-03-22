import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Visit } from "@/types/analytics";

interface RecentVisitsTableProps {
    visits: Visit[];
}

export default function RecentVisitsTable({ visits }: RecentVisitsTableProps) {
    return (
        <Card className="bg-[#191919] shadow">
            <CardHeader>
                <CardTitle>Recent Visits</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visitor</TableHead>
                                <TableHead>Page</TableHead>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visits.map((visit) => (
                                <TableRow key={visit._id} className="hover:bg-accent/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <div className="font-medium">{visit.ip}</div>
                                            <div className="text-sm text-muted-foreground">{visit.language}</div>
                                            <div className="text-sm text-muted-foreground">{visit.screenResolution}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm max-w-xs truncate" title={visit.url}>
                                            {visit.url}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm max-w-xs truncate" title={visit.referrer}>
                                            {visit.referrer || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground max-w-xs truncate" title={visit.userAgent}>
                                            {visit.userAgent}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                                            {new Date(visit.timestamp).toLocaleString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {visits.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No visits recorded yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
} 