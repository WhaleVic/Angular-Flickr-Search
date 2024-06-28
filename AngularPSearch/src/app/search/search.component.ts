import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlickrService } from '../flickr.service';
import { firstValueFrom } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  images: { url: string; title: string }[] = [];
  keyword: string = '';
  tags: string = '';
  minUploadDate: string = '';
  maxUploadDate: string = '';

  constructor(private flickrService: FlickrService) { }

  async performSearch() {
    if (this.keyword && this.keyword.length > 0) {
      try {
        const res = await firstValueFrom(this.flickrService.search_keyword(
          this.keyword, this.tags, this.minUploadDate, this.maxUploadDate
        ));
        this.images = res || [];
      } catch (error) {
        console.error('Error fetching images', error);
      }
    }
  }

  onScroll() {
    if (this.keyword && this.keyword.length > 0) {
      this.flickrService.search_keyword(
        this.keyword, this.tags, this.minUploadDate, this.maxUploadDate
      ).subscribe(res => {
        this.images = [...this.images, ...(res || [])];
      });
    }
  }
}