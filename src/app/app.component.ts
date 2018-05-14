import { Component } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

interface TodoItem {
  id: number;
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private title = 'My To-Do List';
  private todoList: TodoItem[] = [];

  constructor(protected localStorage: LocalStorage) {

    // get saved "To-Do" list or show sample "To-Do" item
    this.localStorage.getItem<TodoItem[]>('realogy.todolist').subscribe((todolist) => {

      if(todolist === null) {
        todolist = [{
          id: Date.now(),
          label: 'Hello World',
          done: false
        }];
      }
      
      this.todoList = todolist;
    });
  }

  /**
   * Add Element
   * 
   * Add new "To-Do" to list.
   * 
   * @param el The label for our new "To-Do" item.
   */
  public addItem(el: HTMLInputElement) {
    this.todoList.push({
      id: Date.now(),
      label: el.value,
      done: false
    });

    el.value = '';

    this._sortItems();
    this._save();
  }

  /**
   * Update Item Status
   * 
   * Change the status of the given "To-Do" item.
   * 
   * @param itemId The id of the given "To-Do" item.
   * @param status The current value of the "To-Do" item's "done" property.
   */
  public updateItemStatus(itemId: number, status: boolean) {
    let itemIndex = this.todoList.findIndex(t => t.id === itemId);
    this.todoList[itemIndex].done = !status;

    this._sortItems();
    this._save();
  }

  /**
   * Delete Item
   * 
   * Delete the given "To-Do" item.
   *  
   * @param itemId The id of the given "To-Do" item.
   */
  public deleteItem(itemId: number) {
    const prompt = confirm('Are you sure you want to delete this item?');

    if(prompt === true) {
      this.todoList = this.todoList.filter( t => t.id !== itemId );
    }

    this._save();
  }

  /**
   * Sort Items
   * 
   * Sorts the "To-Do" list by "not done" then "id".
   */
  private _sortItems() {
    this.todoList.sort((a, b) => {

      // order by "done" value
      if(a.done && !b.done) {
          return 1;
      }
  
      if(!a.done && b.done) {
          return -1;
      }

      // order by "id" value
      if(a.id > b.id) {
        return 1;
      }

      if(a.id < b.id) {
        return -1;
      }

      // handle duplicates
      return 0;
    });
  }

  /**
   * Save List
   * 
   * Saves the current version of the "To-Do" list to localstorage (if available).
   */
  private _save() {
    this.localStorage.setItem('realogy.todolist', this.todoList).subscribe(() => {});
  }
}
