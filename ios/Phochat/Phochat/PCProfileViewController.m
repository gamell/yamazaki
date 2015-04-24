//
//  PCProfileViewController.m
//  Phochat
//
//  Created by Daniel Koh on 4/23/15.
//  Copyright (c) 2015 Carunaga. All rights reserved.
//

#import "PCProfileViewController.h"
#import <BFPaperButton.h>
#import <Parse/Parse.h>
#import <ParseUI/ParseUI.h>

#define showPhotosSegue @"showPhotosSegue"

@interface PCProfileViewController () <PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate>
@property (weak, nonatomic) IBOutlet BFPaperButton *loginButton;
@property (weak, nonatomic) IBOutlet BFPaperButton *photosButton;
@end

@implementation PCProfileViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)didTapLoginButton:(id)sender
{
    PFLogInViewController *logInViewController = [[PFLogInViewController alloc] init];
    logInViewController.delegate = self;
    logInViewController.signUpController.emailAsUsername = YES;
    logInViewController.signUpController.delegate = self;
    [self presentViewController:logInViewController animated:YES completion:nil];
}

- (IBAction)didTapPhotosButton:(id)sender
{
    [self performSegueWithIdentifier:showPhotosSegue sender:self];
}


- (void)logInViewController:(PFLogInViewController *)logInController didLogInUser:(PFUser *)user
{
    [user saveInBackground];
    [logInController dismissViewControllerAnimated:YES completion:nil];
}

- (void)signUpViewController:(PFSignUpViewController *)signUpController didSignUpUser:(PFUser *)user
{
    [signUpController dismissViewControllerAnimated:YES completion:nil];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
