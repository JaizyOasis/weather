import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RootObject } from './weather.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class Weather implements OnDestroy {
  city: string = 'Москва';
  private apiKey: string = 'cd97dbff95ff68059714c709ea9698e9';
  weatherSubscription?: Subscription;
  result: WeatherResult | undefined;
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(private httpClient: HttpClient) {}

  ngOnDestroy() {
    this.weatherSubscription?.unsubscribe();
  }

  getWeather() {
    this.result = undefined;
    this.isLoading = true;
    this.weatherSubscription = this.httpClient
      .get<RootObject>(
        'https://api.openweathermap.org/data/2.5/weather?units=metric&q=' +
          this.city +
          '&appid=' +
          this.apiKey
      )
      .subscribe(
        this.decodeWeatherData.bind(this),
        this.handleError.bind(this)
      );
  }

  decodeWeatherData(weatherData: RootObject) {
    this.isLoading = false;
    this.isError = false;
    this.result = new WeatherResult(
      weatherData.main.temp,
      weatherData.main.feels_like,
      weatherData.main.humidity,
      weatherData.main.pressure,
      weatherData.wind.speed
    );
  }

  handleError(error: any) {
    this.isError = true;
    this.isLoading = false;
  }

  clearResult() {
    this.result = undefined;
  }
}

class WeatherResult {
  constructor(
    public temp: number,
    public feelsLike: number,
    public humidity: number,
    public pressure: number,
    public windSpeed: number
  ) {}
}
