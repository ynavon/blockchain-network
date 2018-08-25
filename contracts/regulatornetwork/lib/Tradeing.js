
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Track the trade of a commodity from one trader to another
 * @param {org.kosher.poc.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCommodity(trade) {
    console.log('trade product');
    const factory = getFactory();
    const namespace = 'org.kosher.poc';
    /*  trade.commodity.owner = trade.newOwner;
      let assetRegistry = await getAssetRegistry('org.knet.Product');
      await assetRegistry.update(trade.commodity);*/
     
      if (trade.commodity.amount >=trade.TransferedAmount)
      { 
        //=======Omit the amount from Holder of the product
        trade.commodity.amount = (trade.commodity.amount-trade.TransferedAmount);
        const ProductRegistry = await getAssetRegistry(namespace + '.Product');
        //await ProductRegistry.update(trade.commodity);
      
        //====create new product asset record for to new holder with the new amount
  
          const order = factory.newResource(namespace, 'Product',        trade.commodity.ProductDescriptorId+"#"+trade.newOwner.HolderId+"#"+trade.TransactionTimestemp.toISOString());
          // order.ProductId=trade.commodity.ProductId;
           order.ProductDescriptorId=trade.commodity.ProductDescriptorId;
           order.Name=trade.commodity.Name;
           order.BatchId = trade.commodity.BatchId;
           order.description=trade.commodity.description;
           order.amount=trade.TransferedAmount;
           order.PType=trade.commodity.PType;
           order.owner=trade.newOwner;
           order.Linkedcert=trade.commodity.Linkedcert;
          //Add parenst and childern
          //order.Parents=trade.commodity; 
           order.Parents=[trade.commodity];
          
           // save the order
            const assetRegistry = await getAssetRegistry(order.getFullyQualifiedType());
            await assetRegistry.add(order);
          //Add child to original product
         if (trade.commodity.Childrens) {
           trade.commodity.Childrens.push(order);
          } else {trade.commodity.Childrens=[order]; }
         await ProductRegistry.update(trade.commodity);
        
        //create HistorianRecord
        const HistorianRecordRegistry = await getAssetRegistry(namespace + '.HistorianRecord');
        const History = factory.newResource(namespace, 'HistorianRecord',order.UniqeProductHolderID );
        History.FromOwner=[trade.commodity.owner];
        History.commodity=[trade.commodity];
        History.ToOwner=trade.newOwner;
        History.BatchId=trade.commodity.BatchId;
        History.TransferedAmount=trade.TransferedAmount;
        History.ProductKashrutStatus= "kashrut status "+ trade.commodity.Linkedcert.STATUS;
        await HistorianRecordRegistry.add(History);  
        
        //add record to certificate
         if (trade.commodity.Linkedcert.linkedRecords) {
         // movementDeparture.to.incomingAnimals.push(movementDeparture.animal);
           trade.commodity.Linkedcert.linkedRecords.push(History);
      } else {
        //  movementDeparture.to.incomingAnimals = [movementDeparture.animal];
        trade.commodity.Linkedcert.linkedRecords=[History];
      }
       // trade.commodity.Linkedcert.linkedRecords.Push(History);
         let certRegistry = await getAssetRegistry(namespace +'.KashrutCertificat');
         await certRegistry.update(trade.commodity.Linkedcert);
          /*  trade.commodity.owner = trade.newOwner;
      let assetRegistry = await getAssetRegistry('org.knet.Product');
      await assetRegistry.update(trade.commodity);*/
      }
    
     else {throw new Error('wrong amount was expected');}   
  }
  /* Track the trade of a commodity from one trader to another
   * @param {org.kosher.poc.MergeINTOProduct} MergeINTOProduct - the trade to be processed
   * @transaction
   */
  async function MergeINTOProduct(MergeINTOProduct) {
    console.log('MergeINTOProduct product');
    const factory = getFactory();
    const namespace = 'org.kosher.poc';
    var Camount=1;
    MergeINTOProduct.commodity.forEach(function(comamount) { if (comamount.amount<=0) {Camount=0;} }); 
    if (Camount >0)
      { 
  //====create new product asset record for to new holder with the new amount
    const mrgprd = factory.newResource(namespace, 'Product',MergeINTOProduct.NewProductDetails.ProductDescriptorId+"#"+MergeINTOProduct.NewProductDetails.owner.HolderId+"#"+MergeINTOProduct.TransactionTimestemp.toISOString());
        // order.ProductId=trade.commodity.ProductId;
           mrgprd.ProductDescriptorId=MergeINTOProduct.NewProductDetails.ProductDescriptorId;
           mrgprd.Name=MergeINTOProduct.NewProductDetails.Name;
           mrgprd.BatchId = MergeINTOProduct.NewProductDetails.BatchId;
           mrgprd.description=MergeINTOProduct.NewProductDetails.description;
           mrgprd.amount=MergeINTOProduct.NewProductDetails.amount;
           mrgprd.PType=MergeINTOProduct.NewProductDetails.PType;
           mrgprd.owner=MergeINTOProduct.NewProductDetails.owner;
           mrgprd.Linkedcert=MergeINTOProduct.NewProductDetails.Linkedcert;
          //Add merged parensts 
           mrgprd.Parents=MergeINTOProduct.commodity;
           // save the new product
            const assetRegistry = await getAssetRegistry(mrgprd.getFullyQualifiedType());
            await assetRegistry.add(mrgprd);
    
            //Add child to all parents products and zero parent amount
           mrgprd.Parents.forEach(function(child) {
           child.amount=0;
              if (child.Childrens) {
           child.Childrens.push(mrgprd);
          } else {child.Childrens=[mrgprd]; }              
              });
           await assetRegistry.updateAll(mrgprd.Parents);
    
    //create HistorianRecord  
    
   //   var i=0;
    
     //create HistorianRecord
        const HistorianRecordRegistry = await getAssetRegistry(namespace + '.HistorianRecord');
        const History = factory.newResource(namespace, 'HistorianRecord',mrgprd.UniqeProductHolderID );
       // History.FromOwner=[MergeINTOProduct.NewProductDetails.owner];
        History.commodity=MergeINTOProduct.commodity;
        History.ToOwner=MergeINTOProduct.NewProductDetails.owner;
        History.BatchId=MergeINTOProduct.NewProductDetails.BatchId;
        History.TransferedAmount=MergeINTOProduct.NewProductDetails.amount;
              
        mrgprd.Parents.forEach(function(parent) {  
         if (History.FromOwner) {History.FromOwner.push=parent.owner;}
          else {History.FromOwner=[parent.owner];}
        }); 
      await HistorianRecordRegistry.add(History); 
      }
       else {throw new Error('wrong amount was expected in one of the merged products');}   
    //add record to certificate - certificate need to be addded manually
  
  }
  
  
  
  /* Track the trade of a commodity from one trader to another
   * @param {org.kosher.poc.PRDQuery} PRDQuery - the trade to be processed
   * @transaction
   */
  async function showPRDQuery(PRDQuery) {
    console.log('selectProducts product');
     let assetRegistry = await getAssetRegistry('org.kosher.poc.Product');
     const results =  await query('P1');
  //   let assetRegistry = await getAssetRegistry('org.knet.KashrutCertificat');
  //   const results =  await query('selectProducts');
  
    results.forEach(results => {
       console.log('trade product');    
       const eventNotification = getFactory().newEvent('org.kosher.poc', 'BasicEvent');
      eventNotification.PRD=results; 
      emit(eventNotification);
     
      });
    
   //   console.log('test');    
   //  let factory = getFactory();
   //   let basicEvent = factory.newEvent('org.knet', 'BasicEvent');
   //   emit(basicEvent);
  }
  
  