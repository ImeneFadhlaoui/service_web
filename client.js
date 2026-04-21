const soap = require('soap');
const WSDL_URL = 'http://localhost:8000/calculator?wsdl';
const TEMP_URL = 'http://localhost:8000/temperature?wsdl';

async function main() {
  try {
    // Créer le client SOAP
    const client = await soap.createClientAsync(WSDL_URL);

    console.log('✅ Client SOAP connecté !');
    console.log(
      '🚀 Opérations disponibles:',
      Object.keys(client.CalculatorService.CalculatorPort)
    );

    console.log('\n--- Tests des opérations ---\n');

    // Test Addition
    const addResult = await client.AddAsync({ a: 10, b: 5 });
    console.log(`Addition: 10 + 5 = ${addResult[0].result}`);

    // Test Soustraction
    const subResult = await client.SubtractAsync({ a: 10, b: 3 });
    console.log(`Soustraction: 10 - 3 = ${subResult[0].result}`);

    // Test Multiplication
    const mulResult = await client.MultiplyAsync({ a: 4, b: 7 });
    console.log(`Multiplication: 4 × 7 = ${mulResult[0].result}`);

    // Test Division
    const divResult = await client.DivideAsync({ a: 20, b: 4 });
    console.log(`Division: 20 ÷ 4 = ${divResult[0].result}`);

    // Test Division par zéro
    console.log('\n--- Test erreur: Division par zéro ---');
    try {
      await client.DivideAsync({ a: 10, b: 0 });
    } catch (error) {
      console.log(
        '❌ Erreur capturée:',
        error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message
      );
    }

    // Test Modulo
    const moduloResult = await client.ModuloAsync({ a: 20, b: 4 });
    console.log(`Modulo: 20 % 4 = ${moduloResult[0].result}`);

    // Test Modulo par zéro
    console.log('\n--- Test erreur: Modulo par zéro ---');
    try {
      await client.ModuloAsync({ a: 10, b: 0 });
    } catch (error) {
      console.log(
        '❌ Erreur capturée:',
        error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message
      );
    }

  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }

try {
  // Test Puissance
  const powerResult = await client.PowerAsync({ a: 2, b: 3 });
  console.log(`Puissance: 2 ^ 3 = ${powerResult[0].result}`);

  // Test Puissance avec exposant négatif
  console.log('\n--- Test cas: Exposant négatif ---');

  const negPower = await client.PowerAsync({ a: 2, b: -2 });
  console.log(`Puissance: 2 ^ -2 = ${negPower[0].result}`);

} catch (error) {
  console.log(
    '❌ Erreur capturée:',
    error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message
  );
}
//Test Temperature 
try {
    const tempClient = await soap.createClientAsync(TEMP_URL);

    console.log('\n🌡️ Client Temperature connecté !');

    const cToF = await tempClient.CelsiusToFahrenheitAsync({ celsius: 25 });
    console.log(`25°C = ${cToF[0].result}°F`);

    const fToC = await tempClient.FahrenheitToCelsiusAsync({ fahrenheit: 100 });
    console.log(`100°F = ${fToC[0].result}°C`);

    const cToK = await tempClient.CelsiusToKelvinAsync({ celsius: 25 });
    console.log(`25°C = ${cToK[0].result}K`);

  } catch (error) {
    console.error('Erreur Temperature:', error.message);
  }
}

main();