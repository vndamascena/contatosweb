import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  //atributos
  endpoint: string = 'http://localhost:5149/api/Contatos';
  contatos: any[] = []; //array de objetos (vazio)


  //método construtor
  constructor(
    //inicilização automática
    private httpClient: HttpClient
  ) {}


  //criando um objeto para capturar e validar todos os campos
  //do formulário de cadastro de contato
  form = new FormGroup({
    //campo 'nome'
    nome : new FormControl('', [
      Validators.required, Validators.minLength(8), Validators.maxLength(100)
    ]),
    //campo 'email'
    email : new FormControl('', [
      Validators.required, Validators.email
    ]),
    //campo 'telefone'
    telefone : new FormControl('', [
      Validators.required, Validators.pattern(/\(\d{2}\)\s\d{5}-\d{4}/)
    ])
  });


  //criando um objeto para capturar e validar todos os campos
  //do formulário de edição de contato
  formEdicao = new FormGroup({
    id : new FormControl(''),
    nome : new FormControl('', [
      Validators.required, Validators.minLength(8), Validators.maxLength(100)
    ]),
    email : new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefone : new FormControl('', [
      Validators.required, Validators.pattern(/\(\d{2}\)\s\d{5}-\d{4}/)
    ])
  });


  //função para exibir mensagens de validação
  //para cada um dos campos do formulário
  get f() {
    return this.form.controls;
  }


  //função para exibir mensagens de validação
  //para cada um dos campos do formulário
  get fEdicao() {
    return this.formEdicao.controls;
  }
 
  //método executado sempre que o componente
  //for aberto (inicializado)
  ngOnInit(): void {


    //executando uma requisição GET para consulta de contatos da API
    this.httpClient.get(this.endpoint)
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => { //bloco que captura a resposta de sucesso
          //guardar os dados obtidos em uma variável
          this.contatos = data as any[];
        },
        error: (e) => { //bloco que captura a resposta de erro
          console.log(e.error);
        }
      })
  }


  //função para capturar o SUBMIT do formulário
  onSubmit() : void {
   
    //executando uma requisição POST para consulta de contatos da API
    this.httpClient.post(this.endpoint, this.form.value)
      .subscribe({ //aguardando a resposta da API
        next: (data: any) => { //retorno de sucesso
          //exibir a mensagem na página
          alert(data.message);          
          //limpar os campos do formulário
          this.form.reset();
          //fazer uma nova consulta na api
          this.ngOnInit();
        },
        error: (e) => { //retorno de erro
          console.log(e);
        }
      })
  }


  //função para excluir o contato, quando o usuário
  //clicar no botão de exclusão
  onDelete(id: string) : void {


    //verificar se o usuário deseja excluir
    if(confirm('Deseja realmente excluir o contato?')) {


      //enviando uma requisição de exclusão para a API
      this.httpClient.delete(this.endpoint + "/" + id)
        .subscribe({
          next: (data: any) => {
            alert(data.message); //exibindo mensagem para o usuário
            this.ngOnInit(); //carregamento novamente a consulta
          },
          error: (e) => {
            console.log(e.error);
          }
        });
    }
  }


  //função para consultar 1 contato através do id
  //executando quando o usuário clicar no botão 'editar' da consulta
  onEdit(id: string) : void {


    //enviando uma requisição para consultar o contato na API
    this.httpClient.get(this.endpoint + "/" + id)
      .subscribe({
        next: (data: any) => {
          //preencher os campos do formulário
          this.formEdicao.patchValue(data);
        },
        error: (e) => {
          console.log(e.error);
        }
      });
  }


  //função para capturar o SUBMIT da edição de contato
  onEditSubmit(): void {


    //requisição PUT para a API (atualizar o contato)
    this.httpClient.put(this.endpoint, this.formEdicao.value)
      .subscribe({
        next: (data: any) => {
          alert(data.message); //exibindo mensagem de sucesso
          this.ngOnInit(); //carregar a consulta de contatos
        },
        error: (e) => {
          console.log(e.error);
        }
      });
  }


}





