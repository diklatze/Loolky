import { Component, OnInit, ViewChild } from '@angular/core';
import { MemberInterface } from '../interfaces/member.interface';
import { NavParams, NavController } from 'ionic-angular';
import { ListManage, } from '../listManage/listManage.component';
import { ModeType, InputListDataInterface } from '../interfaces/listManage.interface';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { PageService } from '../pageHeader/page.service';

@Component({
    selector: 'faculties',
    templateUrl: 'faculties.component.html',
    styles: [`.ui.segment.partial {width: 50em;}`],
})
export class Faculties implements OnInit {
    member: MemberInterface;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;
    pageTitle: string;

    //listManage variables
    @ViewChild(ListManage)
    listManageViewChild: ListManage;
    listTitle: string;
    listNoDataMessage: string;
    listMode: ModeType = ModeType.FREE_TEXT;
    listData: InputListDataInterface = { current_data: null };
    freeTextValidator: (value: string) => boolean;

    ngOnInit() {
        this.freeTextValidator = Faculties.notEmptyNotDigitsValidator;
        this.messageServices.getMessage(Constants.LABEL_FACULTIES, (resultMessage: string) => { this.listTitle = resultMessage });
        this.messageServices.getMessage(Constants.MESSAGE_FACULTIES_NOT_DEFINED, (resultMessage: string) => { this.listNoDataMessage = resultMessage });

        this.memberServices.getFaculties(this.member.shortName).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.listData = res;
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.member.fullName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.member.fullName]);
                        break;

                    default:
                        console.error('Faculties: Error occured on getFaculties. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Faculties: Error occured on getFaculties');
                console.error(err);
            });

    }

    constructor(private nav: NavController, private navParams: NavParams, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.member = this.pageService.getMember();
        this.pageTitle = this.member.fullName + " - Add Faculty";
    }
    
    onClose() {
        this.nav.popToRoot();
    }

    onPublish() {
        if (this.listManageViewChild.isDirty()) {
            console.log(this.listManageViewChild.getList());
            this.memberServices.publishFaculties(this.member.shortName, this.listManageViewChild.getList()).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.showModal(Constants.MESSAGE_SUCCESSFULLY_CHANGED_FACULTIES, this.navBackCallback);
                            break;

                        default:
                            console.error('Faculties: Error occured on publish. Error code: ' + res.code);
                            console.error(res);
                    }
                },
                err => {
                    console.error('Faculties: Error occured on publish');
                    console.error(err);
                });
        }
        else {
            this.showModal(Constants.MESSAGE_NO_CHANGES_WERE_DONE, this.closeModalCallback);
        }

    }

    //validator that accepts non empty strings and no digits
    static notEmptyNotDigitsValidator(value: string): boolean {
        if (value.trim() == '') {
            return false;
        }

        const NOT_CONTAINS_DIGITS_REGEX = /^([^0-9]*)$/;
        if (!NOT_CONTAINS_DIGITS_REGEX.test(value)) {
            return false;
        }
        return true;
    }

    showModal(messageId: string, callbackFunction: Function, messageParameters?: [string]) {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsOKPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    private navBackCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    private closeModalCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
    }

}