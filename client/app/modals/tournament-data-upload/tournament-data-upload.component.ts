import {Component} from '@angular/core';
import {UploadEvent, UploadFile, FileSystemFileEntry} from 'ngx-file-drop';

import {ParserService} from '../../services/parser.service';
import {TournamentDataService} from '../../services/tournament-data.service';
import {Notifications} from '../../services/notifications.service';

@Component({
    selector: 'tournament-data-upload',
    templateUrl: './tournament-data-upload.component.html',
    styleUrls: ['./tournament-data-upload.component.css']
})
export class TournamentDataUpload {

    public file: UploadFile;
    public content: string;
    public fileHovering: Boolean;
    public loading: Boolean;
    public data: any;

    constructor(private parser: ParserService, private tournamentDataService: TournamentDataService, private notifications: Notifications) {
    }

    public dropped(event: UploadEvent) {
        this.file = event.files[0]
        this.loading = true
        if (this.file.fileEntry.isFile) {
            const fileEntry = this.file.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.content = fileReader.result
                    this.parser.parseTournamentData(this.content).subscribe((data: any) => {
                        this.data = data;
                    }, error => {
                        this.notifications.error('Tournament data parsing failed');
                        this.close();
                        this.loading = false;
                    }, () => {
                        this.loading = false;
                    });
                }
                fileReader.readAsText(file, "UTF-8");
            });
        } else {
            this.file = null
        }
    }

    public timeString(dateString) {
        return dateString.match(/T(.+)Z/)[1]
    }

    public upload(event) {
        this.loading = true
        this.tournamentDataService.upload(this.content).subscribe(() => {
            this.notifications.success('Tournament data uploaded');
            this.close();
            this.loading = false;
            this.tournamentDataService.reload();
        }, error => {
            this.notifications.error('Tournament data upload failed');
            this.close();
            this.loading = false;
        });
    }

    public fileOver(event) {
        this.fileHovering = true
    }

    public fileLeave(event) {
        this.fileHovering = false
    }

    public close() {
        document.getElementById('tournament-data-close-button').click();
    }

    public clearModal() {
        this.file = null
        this.content = null
        this.fileHovering = false
        this.loading = false
        this.data = null
    }

}
