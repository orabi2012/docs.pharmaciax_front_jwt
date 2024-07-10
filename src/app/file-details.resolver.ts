import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { FileService } from './services/file.service';

@Injectable({
  providedIn: 'root'
})
export class FileDetailsResolver implements Resolve<File[]> {
  constructor(private fileService:FileService){ }
  resolve(route:ActivatedRouteSnapshot): Observable<File[]> {
    const fileId = route.params['id']
   
    return this.fileService.getFile(fileId);
  }
}
