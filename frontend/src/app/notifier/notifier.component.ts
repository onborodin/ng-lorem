import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { fadeAnimation, rotateAnimation } from '../app.animations'
import { NoticesService, NoticeType, Notice } from '../notices.service'

declare var $: any

interface Message {
    notice: Notice
    id: number
    domId: string
}

type Messages = Message[]
type MessageId = number

@Component({
    selector: 'notifier',
    templateUrl: './notifier.component.html',
    styleUrls: ['./notifier.component.scss'],
    animations: [ fadeAnimation, rotateAnimation ]
})
export class NotifierComponent implements OnInit, OnDestroy {

    notices: Notice[] = []

    messages: Messages = []
    lastMessageId: MessageId = 0
    timeout: number = 5000

    @Input() type : NoticeType = NoticeType.success
    noticeType = NoticeType

    private subscription: any

    constructor(private noticesService: NoticesService) {

        this.subscription = this.noticesService.subject
            .subscribe((notice: Notice) => {
                //var index = this.notices.push(notice) - 1
                var message = this.addMessage(notice)
                setTimeout(() => { this.removeMessage(message) }, this.timeout)
            })
    }

    addMessage(notice: Notice) : Message {
        this.lastMessageId += 1
        var message : Message = { 
            notice: notice,
            id: this.lastMessageId,
            domId: this.noticeId(this.lastMessageId)
        }
        this.messages.push(message)
        return message
    }

    removeMessage(message: Message) {
        var messages = this.messages.filter(function(item, i, arr){
            return message.id !== item.id
        })
        this.messages = messages
    }


    noticeId(index) : string {
        return `xxxnotice${index}`
    }

    hide(index) {
        var notices = this.notices.filter(function(item, i, arr){
            return i !== index
        })
        this.notices = notices
    }

    toastHeaderClass(notice: Notice) : string {
        switch (notice.type) {
            case NoticeType.success: {
                return "toast-header-success"
            }
            case NoticeType.alert: {
                return "toast-header-danger"
            }
            case NoticeType.warning: {
                return "toast-header-warning"
            }
        }
        return "toast-header-info"
    }

    toastClass(notice: Notice) : string {
        switch (notice.type) {
            case NoticeType.success: {
                //return "toast-success ml-auto w-25"
                return "toast-success"
            }
            case NoticeType.alert: {
                return "toast-danger"
            }
            case NoticeType.warning: {
                return "toast-warning"
            }
        }
        return "toast-info"
    }

    toastIcon(notice: Notice) : string[] {
        switch (notice.type) {
            case NoticeType.success: {
                return ['fas', 'check']
            }
            case NoticeType.alert: {
                return ['fas', 'exclamation']
            }
            case NoticeType.warning: {
                return ['fas', 'bell']
            }
        }
        return ['fas', 'info']
    }

    toastSubject(notice: Notice) : string {
        switch (notice.type) {
            case NoticeType.success: {
                return "Success"
            }
            case NoticeType.alert: {
                return "Alert"
            }
            case NoticeType.warning: {
                return "Warning"
            }
        }
        return "Information"
    }


    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
