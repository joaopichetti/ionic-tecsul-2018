import { ToastController, MenuController, Loading, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

export abstract class BaseFormPage {

    form: FormGroup;

    constructor(private toastCtrl: ToastController, private menuCtrl: MenuController, 
                private loadingCtrl: LoadingController, protected formBuilder: FormBuilder) {
        this.criarForm();
    }

    protected abstract criarForm();

    protected criarIndicadorProgresso(): Loading {
        return this.loadingCtrl.create({
            content: 'Aguarde um momento',
            dismissOnPageChange: true
        });
    }

    protected abstract dadosValidos(): boolean;

    ionViewDidLoad(): void {
        this.menuCtrl.enable(false);
    }

    ionViewDidLeave(): void {
        this.menuCtrl.enable(true);
    }

    protected mostrarMensagem(mensagem: string) {
        this.toastCtrl.create({
            message: mensagem,
            position: 'bottom',
            duration: 3000
        }).present();
    }

}