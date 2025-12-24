import { Component, OnInit } from '@angular/core';
import { RequestService, MaintenanceRequest } from '../../../core/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-technician-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    requests: MaintenanceRequest[] = [];
    displayedColumns: string[] = ['id', 'category', 'description', 'status', 'actions'];

    constructor(private requestService: RequestService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.requestService.getRequests().subscribe(data => {
            this.requests = data;
        });
    }

    updateStatus(request: MaintenanceRequest, newStatus: string) {
        if (request.status === newStatus) return;

        this.requestService.updateStatus(request.id!, newStatus).subscribe({
            next: () => {
                this.snackBar.open(`Status updated to ${newStatus}`, 'Close', { duration: 3000 });
                request.status = newStatus as any;
                // Force refresh if needed or just update local model which is done above
            },
            error: () => {
                this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
            }
        });
    }
}
