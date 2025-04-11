import { Component } from '@angular/core';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent {
  tutorial: Tutorial = { title: '', description: '', published: false };
  submissionState = {
    submitted: false,
    inProgress: false,
    error: null as string | null,
  };

  constructor(private tutorialService: TutorialService) {}

  saveTutorial(): void {
    // Prevent duplicate submissions
    if (this.submissionState.inProgress) return;

    this.submissionState.inProgress = true;
    this.submissionState.error = null;

    const tutorialData = {
      title: this.tutorial.title?.trim(),
      description: this.tutorial.description?.trim(),
    };

    this.tutorialService.create(tutorialData).subscribe({
      next: () => {
        this.submissionState.submitted = true;
        this.submissionState.inProgress = false;
      },
      error: (e) => {
        console.error(e);
        this.submissionState.error =
          'Failed to submit tutorial. Please try again.';
        this.submissionState.inProgress = false;
      },
    });
  }

  newTutorial(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.tutorial = { title: '', description: '', published: false };
    this.submissionState = { submitted: false, inProgress: false, error: null };
  }
}
