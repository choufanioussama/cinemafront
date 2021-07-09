import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes:any;
  public cinemas:any;
  public currentVille:any;
  public currentCinema:any;
  public salles: any;
  public currentProjection: any;
  public selectedTickets: any;


  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes=data;
      },err=>{
        console.log(err);
      })
  }

  onGetCinemas(v: any) {
this.currentVille=v;
this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },err=>{
        console.log(err);
      })

  }

  onGetSalles(c: any) {

    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles=data;
        // @ts-ignore
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections=data;
            },err=>{
              console.log(err);
            })
        })
      },err=>{
        console.log(err);
      })
  }

  onGetTicketPlaces(p: any) {

    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[];
      },err=>{
        console.log(err);
      })


  }

  onSelectTicket(t: any) {

if(!t.selected)
{
  t.selected=true;
  this.selectedTickets.push(t);
}
else
{
  t.selected=false;
  this.selectedTickets.splice(this.selectedTickets.indecOf(t),1);
}


  }

  getTicketClass(t: any) {

    let str="btn ";
    if(t.reserve==true)
    {
      str+="btn-danger";
    }
    else if(t.selected)
    {
      str +="btn-warning";
    }
    else
    {
      str+="btn-success";
    }
return str;
  }

  onPayTickets(dataForm:any) {
    // @ts-ignore
    let tickets=[];
    // @ts-ignore
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    // @ts-ignore
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=>{
       alert("Tickets reserve avec succes");
       this.onGetTicketPlaces(this.currentProjection);
      },err=>{
        console.log(err);
      })
  }
}
