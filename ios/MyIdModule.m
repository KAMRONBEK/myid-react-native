//
//  MyIdModule.m
//  MyID
//
//  Created by Kamronbek Juraev on 23/07/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(MyIdModule, RCTEventEmitter)

//RCT_EXTERN_METHOD(startMyId)

RCT_EXTERN_METHOD(startMyId:(NSString *)clientId
                  clientHash:(NSString *)clientHash
                  clientHashId:(NSString *)clientHashId
                  passportData:(NSString *)passportData
                  dateOfBirth:(NSString *)dateOfBirth
                  buildMode:(NSString *)buildMode)

@end

// @interface MyIdModule : RCTEventEmitter <RCTBridgeModule>

// @end
