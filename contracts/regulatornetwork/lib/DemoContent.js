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
 * @param {org.kosher.poc.StartDemo2} trade - the trade to be processed
 * @transaction
 */
async function StartDemo(StartDemo2) {
    var factory = getFactory();
    var NS = 'org.kosher.poc'; 
     var regulators= [  
        factory.newResource(NS, 'REGULATOR', 'REG1'),
        factory.newResource(NS, 'REGULATOR', 'REG2'),
        factory.newResource(NS, 'REGULATOR', 'REG3'),
      ];  
    
     var holders= [  
        factory.newResource(NS, 'Holder', '100'),
        factory.newResource(NS, 'Holder', '101'),
        factory.newResource(NS, 'Holder', '102'),
        factory.newResource(NS, 'Holder', '103'),
        factory.newResource(NS, 'Holder', '104'),
      ];
    
     var mashgiachs= [  
        factory.newResource(NS, 'KashrutMashgiach', 'M1REG1'),
        factory.newResource(NS, 'KashrutMashgiach', 'M2REG2'),
        factory.newResource(NS, 'KashrutMashgiach', 'M2REG3'),
      ];
  
    
    
    
    //regulators
    regulators.forEach(function(reg) {
          reg.REGULATORName="Regulator "+reg.REGULATORId;
          reg.REGULATORaddress="Reg st";   
      });
      const regulatorsRegistry = await getParticipantRegistry(NS + '.REGULATOR');
      await regulatorsRegistry.addAll(regulators);
    //holders
          holders.forEach(function(hld) {
          hld.HolderName="Holder"+hld.HolderId;
          hld.HolderType= "PRODUCER";
          hld.address="holder st";   
      });
      const holdersRegistry = await getParticipantRegistry(NS + '.Holder');
      await holdersRegistry.addAll(holders);
    var i=0;
  //mashgiach
         mashgiachs.forEach(function(msg) {
          msg.HashgachaName="Hashgach "+ msg.HashgachaId;
          msg.KashrutAthhorityOwner= regulators[i++] ; 
          msg.SignitoryNominationGrantedTime= new Date();
          msg.SignitoryExpierOn= new Date(); 
          // i=i+1;
      });
      const mashgiachsRegistry = await getParticipantRegistry(NS + '.KashrutMashgiach');
      await mashgiachsRegistry.addAll(mashgiachs);
    
    //====product asset
    now=new Date();
       var products= [  
        factory.newResource(NS, 'Product', 'PRD1'+"#"+holders[0].HolderId+"#"+now.toISOString()),
      ];
    
    products.forEach(function(prd) {
          prd.ProductDescriptorId ="PRD1";
          prd.Name="product 1";
          prd.BatchId="100000";//can also be the timestemp
          prd.description="Tee biscuites";
          prd.amount=1000;
          prd.PType="PARVE";
          prd.owner=holders[0];
      });
     const prdRegistry = await getAssetRegistry(NS + '.Product');
    // await prdRegistry.addAll(products);
     
    // kashrut certificate (contract)
       var certificates= [  
        factory.newResource(NS, 'KashrutCertificat', products[0].UniqeProductHolderID+"#"+now.toISOString()),
      ];
    
    certificates.forEach(function(crt) {
          crt.KashrutAthhorityOwner=mashgiachs[0].KashrutAthhorityOwner;
          crt.CRTHolder=products[0].owner;
          crt.CRTProduct=products[0];
          crt.GrantedBy=mashgiachs[0];
          crt.GrantedTime=new Date();
          crt.ExpierOn=new Date();
          crt.STATUS="VALID";
          crt.CertificateConditions="chalav nochri";
          
      });
     const crtRegistry = await getAssetRegistry(NS + '.KashrutCertificat');
     await crtRegistry.addAll(certificates);
     products[0].Linkedcert=certificates[0];
    // await prdRegistry.update(products[0]);
     await prdRegistry.addAll(products);
   
  }
  
  
  
  /* Track the trade of a commodity from one trader to another
   * @param {org.kosher.poc.StartDemo} trade - the trade to be processed
   * @transaction
   */
  /*async function StartDemo(StartDemo) {
  
  var factory = getFactory();
      var NS = 'org.kosher.poc';
  
      // create the Holders
      var holder = factory.newResource(NS, 'Holder', '100');
      holder.HolderName="Holder100";
      holder.HolderType= "REGULATOR";
      holder.address="100 holder st";
    
         return getParticipantRegistry(NS+'.Holder')
          .then(function (holderRegistry) {
              // add the holder
              return holderRegistry.addAll([holder]);
          });
    
  
  }*/