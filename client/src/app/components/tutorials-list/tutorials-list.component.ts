import { Component, OnInit } from '@angular/core';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent implements OnInit {
  tutorials: Tutorial[] = [];
  currentTutorial: Tutorial | null = null;
  currentIndex = -1;
  title = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.loadTutorials();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTutorials(): void {
    const loadSub = this.tutorialService.getAll().subscribe({
      next: (tutorials) => {
        this.tutorials = tutorials;
      },
      error: (err) => this.handleError('Failed to load tutorials', err),
    });

    this.subscriptions.add(loadSub);
  }

  refreshList(): void {
    this.resetSelection();
    this.loadTutorials();
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = { ...tutorial };
    this.currentIndex = index;
  }

  clearAllTutorials(): void {
    if (!confirm('Are you sure you want to delete all tutorials?')) {
      return;
    }

    const deleteSub = this.tutorialService.deleteAll().subscribe({
      next: () => this.refreshList(),
      error: (err) => this.handleError('Failed to delete tutorials', err),
    });

    this.subscriptions.add(deleteSub);
  }

  searchByTitle(): void {
    if (!this.title.trim()) {
      this.loadTutorials();
      return;
    }

    this.resetSelection();

    const searchSub = this.tutorialService
      .findByTitle(this.title.trim())
      .subscribe({
        next: (tutorials) => {
          this.tutorials = tutorials;
        },
        error: (err) => this.handleError('Search failed', err),
      });

    this.subscriptions.add(searchSub);
  }

  private resetSelection(): void {
    this.currentTutorial = null;
    this.currentIndex = -1;
  }

  private handleError(context: string, error: unknown): void {
    console.error(`${context}:`, error);
    // In a real app, you might show a user-friendly notification here
  }
}
