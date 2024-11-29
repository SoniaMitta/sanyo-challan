const cds = require('@sap/cds');
const axios = require('axios');
const { json2xml } = require('xml-js');
const fs = require('fs');

module.exports = cds.service.impl(async function () {

    const materialdocapi = await cds.connect.to('API_MATERIAL_DOCUMENT_SRV');

    this.on('READ', 'A_MaterialDocumentHeader', async req => {
        const items = await materialdocapi.run(
            SELECT.from('A_MaterialDocumentItem')
                .where({ GoodsMovementType: '541' })
                .columns(['MaterialDocument', 'SalesOrder', 'PurchaseOrder'])
        );
        const uniqueItems = Array.from(
            new Map(items.map(item => [item.MaterialDocument, item])).values()
        );
        return uniqueItems;
    });

    this.on('print', 'A_MaterialDocumentHeader', async (req) => {
        const { MaterialDocument } = req.params[0];

        try {
            const MaterialDocs = await materialdocapi.run(
                SELECT.from('A_MaterialDocumentHeader').where({ MaterialDocument: MaterialDocument }).columns(
                    'MaterialDocumentYear', 'MaterialDocument', 'InventoryTransactionType', 'DocumentDate', 'PostingDate', 'CreationDate', 'CreationTime', 'CreatedByUser', 'MaterialDocumentHeaderText', 'ReferenceDocument', 'VersionForPrintingSlip', 'ManualPrintIsTriggered', 'CtrlPostgForExtWhseMgmtSyst', 'GoodsMovementCode'
                )
            );

            let combinedResult = [];

            for (let order of MaterialDocs) {
                const MaterialDocItems = await materialdocapi.run(
                    SELECT.from('A_MaterialDocumentItem').where({ MaterialDocument: order.MaterialDocument, GoodsMovementType: '541' }).columns(
                        'MaterialDocumentItem', 'Material', 'Plant', 'StorageLocation', 'Batch', 'GoodsMovementType', 'InventoryStockType', 'InventoryValuationType', 'InventorySpecialStockType', 'Supplier', 'Customer', 'SalesOrder', 'SalesOrderItem', 'SalesOrderScheduleLine', 'PurchaseOrder', 'PurchaseOrderItem', 'WBSElement', 'ManufacturingOrder', 'ManufacturingOrderItem', 'GoodsMovementRefDocType', 'GoodsMovementReasonCode', 'Delivery', 'DeliveryItem', 'AccountAssignmentCategory', 'CostCenter', 'ControllingArea', 'CostObject', 'GLAccount', 'FunctionalArea', 'ProfitabilitySegment', 'ProfitCenter', 'MasterFixedAsset', 'FixedAsset', 'MaterialBaseUnit', 'QuantityInBaseUnit', 'EntryUnit', 'QuantityInEntryUnit', 'CompanyCodeCurrency', 'GdsMvtExtAmtInCoCodeCrcy', 'SlsPrcAmtInclVATInCoCodeCrcy', 'FiscalYear', 'FiscalYearPeriod', 'FiscalYearVariant', 'IssgOrRcvgMaterial', 'IssgOrRcvgBatch', 'IssuingOrReceivingPlant', 'IssuingOrReceivingStorageLoc', 'IssuingOrReceivingStockType', 'IssgOrRcvgSpclStockInd', 'IssuingOrReceivingValType', 'IsCompletelyDelivered', 'MaterialDocumentItemText', 'GoodsRecipientName', 'UnloadingPointName', 'ShelfLifeExpirationDate', 'ManufactureDate', 'SerialNumbersAreCreatedAutomly', 'Reservation', 'ReservationItem', 'ReservationItemRecordType', 'ReservationIsFinallyIssued', 'SpecialStockIdfgSalesOrder', 'SpecialStockIdfgSalesOrderItem', 'SpecialStockIdfgWBSElement', 'IsAutomaticallyCreated', 'MaterialDocumentLine', 'MaterialDocumentParentLine', 'HierarchyNodeLevel', 'GoodsMovementIsCancelled', 'ReversedMaterialDocumentYear', 'ReversedMaterialDocument', 'ReversedMaterialDocumentItem', 'ReferenceDocumentFiscalYear', 'InvtryMgmtRefDocumentItem', 'InvtryMgmtReferenceDocument', 'MaterialDocumentPostingType', 'InventoryUsabilityCode', 'EWMWarehouse', 'EWMStorageBin', 'DebitCreditCode'
                    )
                );

                combinedResult.push({
                    ...order,
                    MaterialDocumentItem: MaterialDocItems,
                });
            }

            jsonData = JSON.stringify(combinedResult, null, 2);
            const wrappedJsonData = { MaterialDocuments: combinedResult };

            const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
            const xmlData = json2xml(wrappedJsonData, xmlOptions);
            console.log("Generated XML : ",xmlData);

            const base64EncodedXML = Buffer.from(xmlData).toString('base64');
            const authResponse = await axios.get('https://chembonddev.authentication.us10.hana.ondemand.com/oauth/token', {
                params: {
                    grant_type: 'client_credentials'
                },
                auth: {
                    username: 'sb-ffaa3ab1-4f00-428b-be0a-1ec55011116b!b142994|ads-xsappname!b65488',
                    password: 'e44adb92-4284-4c5f-8d41-66f8c1125bc5$F4bN1ypCgWzc8CsnjwOfT157HCu5WL0JVwHuiuwHcSc='
                }
            });
            const accessToken = authResponse.data.access_token;
            const pdfResponse = await axios.post('https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/adsRender/pdf?templateSource=storageName', {
                xdpTemplate: 'sonia/Default',
                xmlData: base64EncodedXML,
                formType: "print",
                formLocale: "",
                taggedPdf: 1,
                embedFont: 0
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const fileContent = pdfResponse.data.fileContent;
            return fileContent;

        } catch (err) {
            console.error(err);
            return req.error(500, 'Error retrieving related data');
        }

    });

});
