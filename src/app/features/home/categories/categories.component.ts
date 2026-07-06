import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Category{

  name:string;

  icon:string;

}

@Component({
  selector:'app-categories',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./categories.component.html',
  styleUrl:'./categories.component.scss'
})
export class CategoriesComponent{

  constructor(private router:Router){}

  categories:Category[]=[

    {
      name:'Rice',
      icon:'🌾'
    },

    {
      name:'Turmeric',
      icon:'🟡'
    },

    {
      name:'Corn',
      icon:'🌽'
    },

    {
      name:'Millets',
      icon:'🌿'
    },

    {
      name:'Pulses',
      icon:'🥜'
    },

    {
      name:'Spices',
      icon:'🌱'
    }

  ];

  openCategory(category:string){

    this.router.navigate(
      ['/products'],
      {
        queryParams:{
          category:category
        }
      });

  }

}