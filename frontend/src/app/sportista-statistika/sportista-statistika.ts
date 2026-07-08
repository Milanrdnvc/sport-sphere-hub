import { Component, inject, OnInit } from '@angular/core';
import { StatistikaService } from '../services/statistika.service';
import { Chart, registerables } from 'chart.js';
import { Statistika } from '../models/Statistika';
Chart.register(...registerables);

@Component({
  selector: 'app-sportista-statistika',
  imports: [],
  templateUrl: './sportista-statistika.html',
  styleUrl: './sportista-statistika.css',
})
export class SportistaStatistika implements OnInit {
  ngOnInit(): void {
    this.statistikaService.dohvStatistiku().subscribe({
      next: (s) => {
        console.log(s);
        const stats = s as Statistika;
        this.kreirajSportoviChart(stats.terminiPoSportu);
        this.kreirajTrendChart(stats.aktivnostiPoMesecima);
        this.kreirajOpremaChart(stats.potrosnjaOpreme);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private statistikaService = inject(StatistikaService);

  kreirajSportoviChart(podaci: any[]) {
    const labels = podaci.map((item) => item._id);
    const values = podaci.map((item) => item.brojTermina);

    new Chart('sportoviChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Broj termina',
            data: values,
            backgroundColor: '#0d6efd',
            borderRadius: 6,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  kreirajTrendChart(podaci: any[]) {
    const labels = podaci.map((item) => item._id);
    const values = podaci.map((item) => item.brojAktivnosti);

    new Chart('trendChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ukupno rezervacija',
            data: values,
            borderColor: '#198754',
            backgroundColor: 'rgba(25, 135, 84, 0.1)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  kreirajOpremaChart(podaci: any[]) {
    const labels = podaci.map((item) => item._id);
    const values = podaci.map((item) => item.ukupnoPotroseno);

    new Chart('opremaChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#ffc107', '#dc3545', '#0dcaf0', '#6610f2', '#fd7e14'],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}
