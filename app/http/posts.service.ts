import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {

    constructor(private http: HttpClient) {

    }

    //if our component doesn't care about the response - we can subscribe here in the service/not in the component!
    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };

        this.http.post<{name: string}>('https://angular-http-a91bb-default-rtdb.firebaseio.com/posts.json', postData)
        .subscribe(responseData => {
            console.log(responseData);
        });
    }

    fetchPosts() {
        return this.http.get< {[key: string]: Post}>('https://angular-http-a91bb-default-rtdb.firebaseio.com/posts.json')
            .pipe(map(responseData => {
            const postsArray: Post[] = [];
            for(const key in responseData) {
                if(responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
                }
            }
            return postsArray;
            }));
    }


}