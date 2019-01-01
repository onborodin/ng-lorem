import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Subject, Observable } from 'rxjs'


import { fadeAnimation } from '../app.animations'

import { RPCService, RPCResponce, RPCError } from '../rpc.service'
import { UsersService } from '../users.service'
import { User } from '../models/user.model'

export enum Form {
    all = 0,
    createUser = 1,
    updateUser = 2,
    dropUser = 3,
    listUsers = 4
}

export enum Action {
    closeAll = 0,
    open = 1,
    close = 2,
    update = 3
}

export interface Event {
    destination: Form
    action: Action
}

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [ fadeAnimation ]
})
export class UsersComponent implements OnInit {

    users: User[] = []
    user: User = { id: -1, name: '', password: '', gecos: '' }

    subject: Subject<Event>
    subscription: any

    constructor(private usersService: UsersService) {
        this.subject = new Subject<Event>()
        this.subscription = this.subject.subscribe((event: Event) => {
            if (event.destination == Form.listUsers) {
                if (event.action == Action.update) {
                    this.getList()
                }
            }
        })
    }

    createUser() : boolean {
        this.subject.next({ 
            destination: Form.createUser,
            action: Action.open 
        })
        return false;
    }

    dropUser(user) : boolean  {
        console.log('dropUser', user)

        this.user = user
        this.subject.next({ 
            destination: Form.dropUser,
            action: Action.open
        })
        return false;
    }

    updateUser(user) {
        console.log('updateUser', user)

        this.user = user
        this.subject.next({ 
            destination: Form.updateUser,
            action: Action.open
        })
        return false;
    }

    getList() : boolean {
        this.usersService
            .list()
            .subscribe((res: RPCResponce<User[]>) => {
                this.users = res.result
            })
        return false
    }

    ngOnInit() {
        this.getList()
    }
}
