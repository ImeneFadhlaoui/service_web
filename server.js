const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
// Implémentation des opérations du service
const calculatorService = {
 CalculatorService: {
 CalculatorPort: {
 // Opération Addition
 Add: function(args) {
 const result = parseFloat(args.a) + parseFloat(args.b);
 console.log(`Add: ${args.a} + ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Soustraction
 Subtract: function(args) {
 const result = parseFloat(args.a) - parseFloat(args.b);
 console.log(`Subtract: ${args.a} - ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Multiplication
 Multiply: function(args) {
 const result = parseFloat(args.a) * parseFloat(args.b);
 console.log(`Multiply: ${args.a} * ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Division
 Divide: function(args) {
 if (parseFloat(args.b) === 0) {
 throw {
 Fault: {
 Code: { Value: 'DIVIDE_BY_ZERO' },
 Reason: { Text: 'Division par zéro impossible' }
 }
 };
 }
 const result = parseFloat(args.a) / parseFloat(args.b);
 console.log(`Divide: ${args.a} / ${args.b} = ${result}`);
 return { result: result };
 },
  // Opération Modulo
      Modulo: function (args) {
        const a = parseFloat(args.a);
        const b = parseFloat(args.b);

        if (b === 0) {
          throw {
            Fault: {
              Code: { Value: "MODULO_BY_ZERO" },
              Reason: { Text: "Modulo par zéro impossible" },
            },
          };
        }

        const result = a % b;
        console.log(`Modulo: ${a} % ${b} = ${result}`);

        return { result: result };
      },
      Power: function (args) {
        const a = parseFloat(args.a);
        const b = parseFloat(args.b);

        if (isNaN(a) || isNaN(b)) {
          throw {
            Fault: {
              Code: { Value: "INVALID_INPUT" },
              Reason: { Text: "Entrées invalides" },
            },
          };
        }

        let result;

        if (b < 0) {
          result = 1 / Math.pow(a, Math.abs(b));
        } else {
          result = Math.pow(a, b);
        }

        console.log(`Puissance: ${a} ^ ${b} = ${result}`);

        return { result: result };
      },
 }
 }
 

 };

 const temperatureService = {
  TemperatureService: {
    TemperaturePort: {
      
      // Celsius → Fahrenheit
      CelsiusToFahrenheit: function (args) {
        const c = parseFloat(args.celsius);

        const result = (c * 9) / 5 + 32;

        console.log(`CelsiusToFahrenheit: ${c}°C = ${result}°F`);

        return { result: result };
      },

      // Fahrenheit → Celsius
      FahrenheitToCelsius: function (args) {
              console.log("🔥 FahrenheitToCelsius EXECUTED", args);


        const f = parseFloat(args.fahrenheit);

        const result = ((f - 32) * 5) / 9;

        console.log(`FahrenheitToCelsius: ${f}°F = ${result}°C`);

        return { result: result };
      },

      // Celsius → Kelvin
      CelsiusToKelvin: function (args) {
        const c = parseFloat(args.celsius);

        const result = c + 273.15;

        console.log(`CelsiusToKelvin: ${c}°C = ${result}K`);

        return { result: result };
      },
    },
  },
};

// Lire le fichier WSDL
const wsdlPath = path.join(__dirname, 'calculator.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');


// Démarrer le serveur
app.listen(PORT, function() {
 console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

 // Créer le service SOAP calc
 const calculatorServer = soap.listen(app, '/calculator', calculatorService, wsdl);

 console.log(`🚀 Calculator WSDL disponible sur http://localhost:${PORT}/calculator?wsdl`);

  // Créer le service SOAP temperature 
 const temperatureServer = soap.listen(app, '/temperature', temperatureService, fs.readFileSync('temperature.wsdl','utf8'));

 console.log(`🚀 Temperature WSDL disponible sur http://localhost:${PORT}/temperature?wsdl`);


 // Log des requêtes entrantes (debug)
 calculatorServer.log = function(type, data) {
 console.log(`[${type}]`, data);
 };
 temperatureServer.log = function(type, data) {
 console.log(`[${type}]`, data);
 };
});