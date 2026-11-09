import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { NewFoglalasDbt } from './fogalalas.dto.js';
import fs from "node:fs"



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'Mozi'
    }
  }

  @Get('foglalas')
  @Render('foglalas')
  foglalas(){
    return{
      title: "Jegy foglalás"
    }
  }

  @Post('foglalas')
  @Render('foglalas')
  newfoglalas(@Body() body: NewFoglalasDbt ){

    let errors: string[] = []

    if(!body.nev){
      errors.push("A név kitöltése kötelező!")
    }

    if(!body.email){
      errors.push("Az email kitöltése kötelező!")
    }else{
      if(!/^.+@.+\..+$/.test(body.email)){
        errors.push("Email formátum hibás!")
      }
    }

    if(!body.datum){
      errors.push("A dátum megadása kötelező")
    } else {
      const most = new Date()
      const be = new Date(body.datum)
      if(be <= most){
        errors.push("Leghamarabb a holnapi napra lehet foglalni!")
      }
    }

    if(!body.nezok){
      errors.push("A foglalni kivánt jegyek számát kötelező megadni!")
    } else {
      const szam = parseInt(body.nezok)
      if(szam > 10 || szam < 1){
        errors.push("Minimum 1 és maximum 10 jegyet lehet egyszere foglalni!")
      }
    }

    if(errors.length > 0){
      return{
        title: "Jegy foglalás",
        errors: errors,
        body
      }
    } else {
      const content = {
        nev: body.nev,
        email: body.email,
        datum: body.datum,
        nezok: body.nezok
      }

      fs.writeFileSync("./public/mentes.json", JSON.stringify(content), "utf8")

      return{
        title: "Jegy foglalás",
        success: true
      }
    }
  }
}
