import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface EditComponent {
  hasChanges: () => boolean;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<EditComponent> {
  canDeactivate(component: EditComponent): boolean {
    if (component.hasChanges()) {
      return confirm("You have unsaved changes. Are you sure you want to leave this page?"); 
    }
    return true;  
  }
}