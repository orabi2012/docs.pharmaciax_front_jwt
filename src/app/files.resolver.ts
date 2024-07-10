import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { FileService } from './services/file.service';

@Injectable({
  providedIn: 'root'
})
export class FilesResolver implements Resolve<File[]> {
  constructor(private fileService:FileService){}
  resolve(): Observable<File[]> {
    return this.fileService.getAll()
  }
}
