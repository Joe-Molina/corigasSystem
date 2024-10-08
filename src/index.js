import express from "express";
import xlsx from "xlsx-populate";
import fs from "fs";

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
  const workbook = await xlsx.fromFileAsync('./informesGas/informeGasOctubre.xlsx')
  const value = await workbook.sheet("DATOS").range('N3:AD12').value()

  const deudas = {}

  value.forEach((value) => {
    if (value[14] != 0) {
      deudas[value[0]] = {
        kg10: {
          cantidad: value[1],
          divisa: value[2],
          Bs: value[3].toFixed(2)
        },
        kg18: {
          cantidad: value[4],
          divisa: value[5],
          Bs: value[6].toFixed(2)
        },
        kg27: {
          cantidad: value[7],
          divisa: value[8],
          Bs: value[9].toFixed(2)
        },
        kg43: {
          cantidad: value[10],
          divisa: value[11],
          Bs: value[12].toFixed(2)
        },
        totalBs: value[14].toFixed(2),
        totalDivisa: value[15],
        punto: value[0]
      }
    }
  })

  const deudasText = () => {
    return Object.values(deudas).map((deuda) => {
      return `${deuda.punto.toUpperCase()} \n ${deuda.kg10.cantidad != 0 ? `Kg 10: ${deuda.kg10.cantidad} - $ ${deuda.kg10.divisa} - Bs: ${deuda.kg10.Bs} \n` : ""} ${deuda.kg18.cantidad != 0 ? `Kg 18: ${deuda.kg18.cantidad} - $ ${deuda.kg18.divisa} - Bs: ${parseFloat(deuda.kg18.Bs, 2)} \n` : ''} ${deuda.kg27.cantidad != 0 ? `Kg 27: ${deuda.kg27.cantidad} - $ ${deuda.kg27.divisa} - Bs: ${parseFloat(deuda.kg27.Bs, 2)} \n` : ""} ${deuda.kg43.cantidad != 0 ? `Kg 43: ${deuda.kg43.cantidad} - $ ${deuda.kg43.divisa} - Bs: ${parseFloat(deuda.kg43.Bs, 2)} \n` : ""} \n Total a pagar: Bs - ${parseFloat(deuda.totalBs, 2)} - $ ${parseFloat(deuda.totalDivisa, 2)}  `
    })
  }

  fs.writeFileSync('./informesGas/deudasGasOctubre.txt', deudasText().join('\n\n'))

  res.json(await deudasText())
})

const port = 3000
app.listen(port, () => { console.log('server corriendo manooo') });