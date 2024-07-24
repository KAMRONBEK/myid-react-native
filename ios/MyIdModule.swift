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
  
  @objc func startMyId() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            let config = MyIdConfig()
            config.clientId = "emit_sdk-pEXr5TMHOHYL5QcP2JjObte94zS0vPpLnjbqTigm" // Your Client ID
            config.clientHash = "f79e7195-cf94-4bdd-9115-6c08033e191c" // Your Client Hash
            config.clientHashId = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwgGX9AQqActMnsW5K++GXYYCynxB/RQVMRSBsYCjSEmIrKaV8InLDxoG+WE2AY7lGyoo9qkxzKg1Vk6tW8pBW5PpNSH6xN1P9ufEnHQWuXCpdT+UkAoVMGnoYQ6glp9mZVlPEottslt6THAGa9wf3fMku97UdsuSctOeGXDr3LnsCFB7ZmaracTQFQ41v6SMbGZX2NsIKVtlJMZqAle9sI3crk9RGRg7Os8f1NolNNFuWQEjx/DpaSjCHGMMscWkSX7GEqJiVSNybGquHe1vjtswoT3oO2Mr+uCfz6Owx/d0/0Q8YWxvhorxbGT0CEw1m0CU+JbWh2lrgf1jHvBULQIDAQAB" // Your Client Hash ID
            config.passportData = self.passportTextField.text ?? ""
            config.dateOfBirth = self.dobTextField.text ?? ""

            config.buildMode = MyIdBuildMode.PRODUCTION
            config.withPhoto = true
            
            MyIdClient.start(withConfig: config, withDelegate: self)
        }
    }
}

extension MyIdModule: MyIdClientDelegate {
  func onSuccess(result: MyIdSDK.MyIdResult) {
    sendEvent(
      withName: "onSuccess",
      body: [
        "code": result.code,
        "comparison": result.comparisonValue
      ]
    )
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
