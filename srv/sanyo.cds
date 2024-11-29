using { API_MATERIAL_DOCUMENT_SRV as external } from './external/API_MATERIAL_DOCUMENT_SRV';

service sanyo{
    entity A_MaterialDocumentHeader as projection on external.A_MaterialDocumentHeader{
        key MaterialDocument,
        to_MaterialDocumentItem,
         null as SalesOrder: String(50),
        null as SalesOrderItem: String(50),
         null as PurchaseOrder: String(50),
        null as GoodsMovementType: String(50),
    } actions {
        action print() returns String;
    };
}

annotate sanyo.A_MaterialDocumentHeader with @(
    UI.SelectionFields: [ SalesOrder , MaterialDocument],  
UI.LineItem:[
        {
            $Type:'UI.DataField',
            Value: MaterialDocument
        },
        {
            $Type:'UI.DataField',
            Value: PurchaseOrder
        },
        {
            $Type:'UI.DataField',
            Value: SalesOrder
        },
    ]
);