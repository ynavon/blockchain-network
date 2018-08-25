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

 // Invoke Certificate
/* Track the trade of a commodity from one trader to another
 * @param {org.kosher.poc.InvokeNewKosherCertificate} InvokeNewKosherCertificate - the trade to be processed
 * @transaction
 */
async function InvokeCertificate(InvokeNewKosherCertificate) {
    console.log('trade product');
    const factory = getFactory();
    const namespace = 'org.kosher.poc';
    // create new certificate
    
    const certificate = factory.newResource(namespace, 'KashrutCertificat',InvokeNewKosherCertificate.CRTProduct.UniqeProductHolderID+"#"+InvokeNewKosherCertificate.TransactionTimestemp.toISOString());
    // order.ProductId=trade.commodity.ProductId;
    certificate.KashrutAthhorityOwner=InvokeNewKosherCertificate.GrantedBy.KashrutAthhorityOwner;
    certificate.CRTHolder=InvokeNewKosherCertificate.CRTProduct.owner;
    certificate.CRTProduct=InvokeNewKosherCertificate.CRTProduct;
    certificate.GrantedBy=InvokeNewKosherCertificate.GrantedBy;
    certificate.GrantedTime=InvokeNewKosherCertificate.TransactionTimestemp;
    certificate.ExpierOn=InvokeNewKosherCertificate.ExpieryTimestemp;
    certificate.STATUS=InvokeNewKosherCertificate.STATUS;
    certificate.CertificateConditions=InvokeNewKosherCertificate.CertificateConditions;
   // save the order
            const assetRegistry = await getAssetRegistry(certificate.getFullyQualifiedType());
            await assetRegistry.add(certificate); 
            const ProductRegistry = await getAssetRegistry(InvokeNewKosherCertificate.CRTProduct.getFullyQualifiedType());
    // update product
    InvokeNewKosherCertificate.CRTProduct.Linkedcert=certificate;
     let PRDRegistry = await getAssetRegistry(namespace+'.Product');
      await PRDRegistry.update(InvokeNewKosherCertificate.CRTProduct);
      /*  trade.commodity.owner = trade.newOwner;
      let assetRegistry = await getAssetRegistry('org.knet.Product');
      await assetRegistry.update(trade.commodity);*/
    
  
  }
  
  // =====RevokeKosherCertificate
  
  /* Track the trade of a commodity from one trader to another
   * @param {org.kosher.poc.RevokeKosherCertificate} RevokeKosherCertificate - the trade to be processed
   * @transaction
   */
  async function RevokeCertificate(RevokeKosherCertificate) {
    console.log('trade product');
    const factory = getFactory();
    const namespace = 'org.kosher.poc';
    // Revoke exististing certificate
    
    // const removeNotification = getFactory().newEvent(namespace, 'RemoveNotification');
    //      removeNotification.commodity = trade;
    //      emit(removeNotification);
    
    RevokeKosherCertificate.CertToRevoke.STATUS="REVOKE";
    RevokeKosherCertificate.CertToRevoke.ExpierOn=RevokeKosherCertificate.TransactionTimestemp;
    let assetRegistry = await getAssetRegistry(namespace+'.KashrutCertificat');
  
    await assetRegistry.update(RevokeKosherCertificate.CertToRevoke);
     
  }
  
  // =====RevokeKosherCertificate
  
  /* Track the trade of a commodity from one trader to another
   * @param {org.kosher.poc.RevokeProductkashrut} RevokeProductkashrut - the trade to be processed
   * @transaction
   */
  async function RevokeProductkashrut(RevokeProductkashrut) {
    //Run throgh all product children - break tree reocure
    //Update certificate - Remove product from the linked kosher certificate
    //Update product remove product link to to kosher certificate
  }
  