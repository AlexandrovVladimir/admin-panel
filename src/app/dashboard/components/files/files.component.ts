import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Observable, Subject } from 'rxjs';
import { IPost } from '../../../shared/interfaces/post';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {

  public posts$: Observable<IPost[]>;
  public posts: IPost[];
  public search: string;
  public page: number;
  public itemsPerPage: number;
  public loading: boolean;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _postsService: PostsService) {
    this.page = 1;
    this.itemsPerPage = 4;
    this.posts = [];
    this.loading = true;
  }

  ngOnInit(): void {
    this._postsService.getAll()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(posts => {
        setTimeout(() => {
          this.posts = posts;
          this.loading = false;
        }, 1500);
      });
  }

  public deletePost(id: number | string) {
    this._postsService.remove(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this.posts = this.posts.filter(post => post.id !== id));
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
