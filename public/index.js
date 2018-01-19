'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

for (const deliveriy of deliveries) { 

	
	//Computation of the price
	deliveriy.price = deliveriy.distance + deliveriy.volume;
	
	for(const i of truckers) {
		if(deliveriy.truckerId == i.id){
			if(i.pricePerVolume >= 5 && i.pricePerVolume < 10){
				deliveriy.price = deliveriy.price - 0.10 * deliveriy.price;
			}
			else if(i.pricePerVolume >= 10 && i.pricePerVolume < 25){
				deliveriy.price = deliveriy.price - 0.30 * deliveriy.price;
			}
			else if(i.pricePerVolume >= 25){
				deliveriy.price = deliveriy.price - 0.50 * deliveriy.price;
			}
		}
	}
	
	//Computation of the comissions
	deliveriy.commission.insurance = Math.round((deliveriy.price * 0.3) / 2 , 2);
	deliveriy.commission.treasury = Math.ceil(deliveriy.distance / 500);
	deliveriy.commission.convargo = Math.round((deliveriy.price * 0.3) - deliveriy.commission.insurance - deliveriy.commission.treasury, 2);
	
	//Computation of the deductible option
	if(deliveriy.options.deductibleReduction == true){
		deliveriy.price += deliveriy.volume;
		deliveriy.commission.convargo += deliveriy.volume;
	}
	
	//Pay the actors
	for(const actor of actors) {
		if(deliveriy.id == actor.deliveryId){
			for(const pay of actor.payment){
				if(pay.who == 'shipper' && pay.type == 'debit'){
					pay.amount = deliveriy.price;
				}
				else if(pay.who == 'insurance' && pay.type == 'credit'){
					pay.amount = deliveriy.commission.insurance;
				}
				else if(pay.who == 'treasury' && pay.type == 'credit'){
					pay.amount = deliveriy.commission.treasury;
				}
				else if(pay.who == 'convargo' && pay.type == 'credit'){
					pay.amount = deliveriy.commission.convargo;
				}
				else if(pay.who == 'trucker' && pay.type == 'credit'){
					pay.amount = deliveriy.price - deliveriy.commission.insurance - deliveriy.commission.treasury - deliveriy.commission.convargo;
				}
			}
		}
	}
}



console.log(truckers);
console.log(deliveries);
console.log(actors);
