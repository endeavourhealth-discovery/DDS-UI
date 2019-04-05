import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {RabbitBinding} from "./models/RabbitBinding";
import {RabbitExchange} from "./models/RabbitExchange";
import {RabbitQueue} from "./models/RabbitQueue";
import {RabbitNode} from "./models/RabbitNode";
import {Routing} from "./Routing";

@Injectable()
export class RabbitService {
	constructor(private http : Http) { }

	getRabbitNodes() : Observable<RabbitNode[]> {
		return this.http.get('api/rabbit/nodes')
      .map((result) => result.json());
	}

	pingRabbitNode(address:string) : Observable<RabbitNode> {
		let params = new URLSearchParams();
		params.append('address', address);
		return this.http.get('api/rabbit/ping', {search : params})
      .map((result) => result.json());
	}

	getRabbitQueues(address:string) : Observable<RabbitQueue[]> {
		let params = new URLSearchParams();
		params.append('address', address);
		return this.http.get('api/rabbit/queues', {search : params})
      .map((result) => result.json());
	}

	getRabbitExchanges(address:string) : Observable<RabbitExchange[]> {
		let params = new URLSearchParams();
		params.append('address', address);
		return this.http.get('api/rabbit/exchanges', {search : params})
      .map((result) => result.json());
	}

	getRabbitBindings(address:string) : Observable<RabbitBinding[]> {
		let params = new URLSearchParams();
		params.append('address', address);
		return this.http.get('api/rabbit/bindings', {search : params})
      .map((result) => result.json());
	}

	synchronize(address:string) : Observable<any> {
		return this.http.post('api/rabbit/synchronize', address );
	}

	getRoutings() : Observable<Routing[]> {
		return this.http.get('api/rabbit/routings')
      .map((result) => result.json());
	}

	saveRoutings(routings : Routing[]) : Observable<any> {
		return this.http.post('api/rabbit/routings', routings);
	}
}
