//
//  MyIdModule.swift
//  MyID
//
//  Created by Kamronbek Juraev on 23/07/24.
//

import Foundation
import React
import MyIdSDK

@objc(MyIdModule)
class MyIdModule: RCTEventEmitter {
  
  private let passportTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Passport data"
        textField.borderStyle = .roundedRect
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    private let dobTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Date of birth"
        textField.borderStyle = .roundedRect
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()


  @objc
  static func constantsToExport() -> [String: Any] {
    return ["initialCount": 0]
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  override func supportedEvents() -> [String]! {
    return ["onSuccess", "onError", "onUserExited"]
  }
  
  @objc(startMyId:clientHash:clientHashId:passportData:dateOfBirth:buildMode:)
  func startMyId(clientId: String, clientHash: String, clientHashId: String, passportData: String, dateOfBirth: String, buildMode: String) {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
          let config = MyIdConfig()
          config.clientId = clientId
          config.clientHash = clientHash
          config.clientHashId = clientHashId
          config.passportData = passportData
          config.dateOfBirth = dateOfBirth

          let mode = buildMode == "PRODUCTION" ? MyIdBuildMode.PRODUCTION : MyIdBuildMode.DEBUG
          config.buildMode = mode
          config.withPhoto = true
          config.entryType = MyIdEntryType.FACE
          
          MyIdClient.start(withConfig: config, withDelegate: self)
      }
  }
}

extension MyIdModule: MyIdClientDelegate {
  func onSuccess(result: MyIdSDK.MyIdResult) {
         // Assuming `result.image` is a UIImage
         if let image = result.image {
             if let imageData = image.jpegData(compressionQuality: 1) { // Compression quality can be adjusted
                 let base64String = imageData.base64EncodedString(options: .lineLength64Characters)
                 sendEvent(withName: "onSuccess", body: ["code": result.code, "comparison": result.comparisonValue, "image": base64String])
             } else {
                 // Handle failure to get image data
                 sendEvent(withName: "onError", body: ["message": "Failed to convert image to Data", "code": 0])
             }
         } else {
             // Handle the case where there is no image
             sendEvent(withName: "onError", body: ["message": "No image available", "code": 0])
         }
     }
  
  func onError(exception: MyIdSDK.MyIdException) {
    sendEvent(
      withName: "onError",
      body: [
        "message": exception.message,
        "code": exception.code
      ]
    )
  }
  
  func onUserExited() {
    sendEvent(
      withName: "onUserExited",
      body: [
        "message": "exited"
      ]
    )
  }
}
