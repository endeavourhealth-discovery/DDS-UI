import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Exchange} from "./Exchange";
import {TransformErrorSummary} from "./TransformErrorSummary";
import {TransformErrorDetail} from "./TransformErrorDetail";
import {Protocol} from "./Protocol";

@Injectable()
export class ExchangeAuditService {
    constructor(private http:Http) { }


    getExchangesByDate(serviceId: string, systemId: string, maxRows: number, dateFrom: Date, dateTo: Date) : Observable<Exchange[]> {
        console.log('Getting for service ' + serviceId + ' system ' + systemId + ' and ' + maxRows + ' from ' + dateFrom + ' to ' + dateTo);

        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('maxRows', '' + maxRows);
        if (dateFrom) {
            params.append('dateFrom', '' + dateFrom.getTime());
        } else {
            params.append('dateFrom', '');
        }
        if (dateTo) {
            params.append('dateTo', '' + dateTo.getTime());
        } else {
            params.append('dateTo', '');
        }

        return this.http.get('api/exchangeAudit/getExchangesByDate', { search : params})
          .map((result) => result.json());
    }

    getRecentExchanges(serviceId: string, systemId: string, maxRows: number) : Observable<Exchange[]> {
        console.log('Getting for service ' + serviceId + ' system ' + systemId + ' and ' + maxRows);

        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('maxRows', '' + maxRows);

        return this.http.get('api/exchangeAudit/getRecentExchanges', { search : params})
          .map((result) => result.json());
    }

    getExchangesFromFirstError(serviceId: string, systemId: string, maxRows: number) : Observable<Exchange[]> {
        console.log('Getting for service ' + serviceId + ' system ' + systemId + ' and ' + maxRows);

        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('maxRows', '' + maxRows);

        return this.http.get('api/exchangeAudit/getExchangesFromFirstError', { search : params})
          .map((result) => result.json());
    }

    getExchangeById(serviceId: string, systemId: string, exchangeId:string) : Observable<Exchange[]> {
        var params = new URLSearchParams();
        console.log('Getting for service id ' + serviceId + ' and exchange id ' + exchangeId);
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('exchangeId', exchangeId);

        return this.http.get('api/exchangeAudit/getExchangeById', { search : params})
          .map((result) => result.json());
    }

    /*getExchangeEvents(exchangeId:string) : Observable<ExchangeEvent[]> {
        var params = new URLSearchParams();
        params.append('exchangeId', exchangeId);

        return this.httpGet('api/exchangeAudit/getExchangeEvents', { search : params});
    }*/

    postToExchange(exchangeId: string, serviceId: string, systemId: string, exchangeName: string, postMode: string,
                   postSpecificProtocol: string, fileTypesToFilterOn: string):Observable<any> {

        var request = {
            'exchangeId': exchangeId,
            'serviceId': serviceId,
            'systemId': systemId,
            'exchangeName': exchangeName,
            'postMode': postMode,
            'specificProtocolId': postSpecificProtocol,
            'fileTypesToFilterOn': fileTypesToFilterOn
        };
        return this.http.post('api/exchangeAudit/postToExchange', request);
    }



    getTransformErrorSummaries():Observable<TransformErrorSummary[]> {
        return this.http.get('api/exchangeAudit/getTransformErrorSummaries')
          .map((result) => result.json());
    }

    getInboundTransformAudits(serviceId:string, systemId:string, exchangeId:string,
                              getAllAuditsAndEvents:boolean) : Observable<TransformErrorDetail[]> {
        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('exchangeId', exchangeId);
        params.append('getAllAuditsAndEvents', '' + getAllAuditsAndEvents);

        return this.http.get('api/exchangeAudit/getInboundTransformAudits', { search : params})
          .map((result) => result.json());
    }

    rerunFirstExchangeInError(serviceId: string, systemId: string):Observable<TransformErrorSummary> {
        var request = {
            'serviceId': serviceId,
            'systemId': systemId
        };
        return this.http.post('api/exchangeAudit/rerunFirstExchangeInError', request)
          .map((result) => result.json());
    }

    rerunAllExchangesInError(serviceId: string, systemId: string) : Observable<any> {
        var request = {
            'serviceId': serviceId,
            'systemId': systemId
        };
        return this.http.post('api/exchangeAudit/rerunAllExchangesInError', request);
    }

    getTransformErrorLines(serviceId:string, systemId:string, exchangeId:string, version:string) : Observable<string[]> {
        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);
        params.append('exchangeId', exchangeId);
        params.append('version', version);

        return this.http.get('api/exchangeAudit/getTransformErrorLines', { search : params})
          .map((result) => result.json());
    }

    /*postTest(serviceId: string):Observable<any> {
        var request = {
            'serviceId': serviceId
        };
        console.log("Post test in service class");
        return this.httpPost('api/exchangeAudit/postTest', request);
    }*/

    getProtocolsList(serviceId:string, systemId:string) : Observable<Protocol[]> {

        var params = new URLSearchParams();
        params.append('serviceId', serviceId);
        params.append('systemId', systemId);

        return this.http.get('api/exchangeAudit/getProtocolsForService', { search : params})
          .map((result) => result.json());
    }
}
